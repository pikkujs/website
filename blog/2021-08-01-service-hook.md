---
title: React and VanillaJS Services 
description: A dive into the use-service-hook to tie state management directly to ES6 classes without the need for contexts or redux
---

Today I want to share a design that I have been using for maintaining state in react since the emergence of hooks.

<!-- truncate -->

There have been quite a few posts lately around how redux is a bit too complex for a lot of current applications. The current solution usually seems to recommend using `Context` or the `useReducer` hook provided by the reactJS library.

Before I begin, I'm not great at content writing, so if you find any mistakes feel free to fix them in a PR or let me know so I can improve going forward. Thanks!

### My state-management experiences

You can skip this part if you want to see [how it just works](#the-now---how-it-works).

#### The earliest era

The evolution of state management in my day to day job started in 2010. Back then we have a custom rendering framework (as almost all companies did) and we had a vanilla JS model. The logic was separated and for the most part, we just wrote JS classes (via adding methods directly to the prototype) and emitted events whenever things changed and called the methods directly from the controller. It was a simple life, except everything was custom written and the custom framework is very similar to XML.. but it was 2010.

#### The early mid-era

We then moved towards [KnockoutJS](https://knockoutjs.com/). It was one of the more powerful frameworks around (mostly competing VS [jQuery](https://jquery.com/) and [Angular1](https://angularjs.org/) and works by having your properties all being observables. So `name()` returns name, `name('bob')` updates it. If you tied your HTML to the observable it would be able to read and update it.

The library itself was great, but unfortunately, the adoption went a bit too far and the entire logic ended up moving into the view. This meant we no longer had vanillaJS domain logic, and all of our code was driven by observables. This resulted in us implementing a reactive layer on top to sort out those events and aggregate them, which again led to reinventing the wheel. Plus, that's just the first level of impact in terms of knock-on effects. We ended up writing a proprietary semi BDD testing layer and it was just.. odd. This was still back in the days of IE6 support, so just using a shim of `forEach` would occasionally result in the screen of unresponsiveness, let alone thousands of observables going off due to ping pong effects.

#### The mid era

So I was eventually allowed to implement another design. The exact memory is a little fuzzy, but I'm tempted to say it was because we (myself and two colleagues) won a hackathon where we were able to implement a trade model with an infinite (memory and CPU constraints aside) amount of sub-trades. Turned out there was another team who had to implement that feature and a scrum master helped make the case. The solution wasn't perfect since it was still based on observables, but it worked for small to medium model sizes.

The idea was models that have decorators mixed in.

Something like...

```typescript
const model = new Model()
model.add(EmployeeMixin)
model.add(BirthdayMixin)

// And each one of those would add properties to the model which you can set
model.set('age',35)

// and read via
model.get('get')

// Most importantly though, you can listen to any field change
// which is where the renderers subscribe
model.onChange('age', (newAge, oldAge) => {})
```

This pretty much meant you can allow a very small JS library to deal with all computation without needing to touch any DOM concepts. And since we were a software company with multiple clients, we were able to compose different models using the same mixins which sped development and new features up nicely.

The biggest impact was in older browsers. We sped up rendering complex tickets from seconds to milliseconds, mostly by avoiding hundreds of observables being triggered during load time. Detaching from knockout also meant we were able to write some pure vanilla JS components using the same logic, which back then had a large performance improvement when dealing with windowing.

#### The startup era

This period was mostly based on backend development, so a blog post for another day. For the frontend, we just bought an Angular 1 template for 7 bucks and tweaked it to work. Wasn't great, Angular1 was already years old but there weren't yet any quality React or Vue templates ready to use.

#### The late mid-era

After the startup crashed I had the fortunate luck of getting a position with a group of team members from the early/mid ERA. In less than a year they built a feature-rich real-time financial web application that worked well on both phones and desktops. During this era, I got my crash introduction to React, Redux and Reselect.

The main/only downsides I encountered were:

1) The fact the codebase was all in JS made the migration to typescript more painful. Redux has a few libraries (like redux-fsa) which makes it easier to use typescript, but it involved a lot of rework.

2) Since the way we used reselect was based on taking things, combining them and passing them on (it was a very client-heavy app) there are quite a few layers to wrap your head around. Combined with the general overhead of redux reducers/actions/dispatchers it made code navigation more complex than I hoped, where onboarding usually required a time window to grasp the context followed by decent productivity.

It's worth mentioning this was all before Hooks came out, and in the last couple of months, the team already simplified/refactored a bunch of HOC to be easier to worth with. 

#### The recent era

I don't want to go too deep into this era since there are just too many oddities to explain. Let's just say it was a bit of a dark and weird place in state management history. I started freelancing and saw different state management systems which just baffled me in terms of complexity. Inheritance, composition, observables, reactive code all sort of forcefully existing together. Unfortunately, it was one of those "the original developer set it up" sorts of situations and the cost of changing it was extremely high.

I also started on my projects initially with the impression I'll use redux and typescript to build all my logic. But as I constantly refactored things whilst adding features I found the process painful. I was doing most of my logic in the model layer and switching from the backend to the frontend always gave me a bit of dread. There had to be a way for me to regain my sanity.

###  The now - how it works

So I got up one day and wrote down the following criteria (in order of importance):

1) It has to be super typescript friendly
2) It has to be React agnostic
3) It has to support real-time updates
4) It has to be unit testable without any none core libraries like assert/chai
5) It has to support both `sync` and `async` methods
6) It has to have no dependencies
7) When used by React, has to be performant and only update what and when I want it to
8) When used by React, has to be super easy to use
9) Passing references to it should be simple
10) It has to be easy to create sub-states. A state per component for example.

Armed with those concepts, and the random mix of experience over the last decade, I decided to go back to my roots with the addition of React hooks.

Let us look at an example:

```typescript

// First thing we need is a bunch of events to emit when things change
enum EmployeeServiceEvents {
    EMPLOYEE_CHANGED = 'EMPLOYEE_CHANGED',
    EVENTS_CHANGED = 'EVENTS_CHANGED'
}

// Then the actual service
class EmployeeService extends EventEmitter3 {
    private employees: Record<string, Human>()

    // This method isn't async because we use it to initialise state and react state
    // initialization is sync. So the goal is to return undefined if not locally loaded
    // and trigger the event once it is.
    public getEmployee (employeeId: string) {
        const employee = this.employees.get(employeeId)
        if (employee) {
            return employee
        }

        const employeeUpdated = (employee) => {
            // This sets the employee for future reference
            this.employees.set(employeeId, employee)
            // And emits an event scored to the employeeId
            this.emit(`${EmployeeServiceEvents.EMPLOYEE_CHANGED}_${employeeId}`, employee) 
        }

        // Using basic pub-sub we can subscribe to any changes. This assumes the entire 
        // employee is sent out with each update which usually isn't the case.
        real-time service.subscribe(`employee:${employeeId}`, employeeUpdated)

        // This is the rest wrapper around fetch used in pikku to minimize boilerplate
        get(`api/employee/${employeeId}`).then(employeeUpdated)
    }

    // So this here
    public async updateEmployeeName (employeeId: string, name: string) {
        const employee = this.employees.get(employeeId)
        // This api should not be called if the employee isn't loaded.
        if (!employee) {
            throw new Error('Employee not loaded')
        }
        // We use spreading to create a new object for immutability
        const updatedEmployee = { ...employee, name }
        this.employees.set(employeeId, updatedEmployee)
        // This will inform all the hooks that care about the entire employee
        this.emit(`${EmployeeServiceEvents.EMPLOYEE_CHANGED}_${employeeId}`, updatedEmployee)
        // This will inform any hooks that care about a specific field
        this.emit(`${EmployeeServiceEvents.NAME_CHANGED}_name_${employeeId}`, name)
    }

    // If using a realtime service, make sure to unsubscribe everything when completed.
    public destroy () {
        for (const employeeId of Object.values(this.employees)) {
            realtimeService.unsubscribe(employeeId)
        }
    }
}
```

The general gist is that everything is written in vanilla JS, and updated things have to be immutable. You can also decide on your favourite approach to update things. In projects where I send deltas to the backend, I apply the changes locally. For other services where knowing the updated state of the server is important I wait for the updated version and set that.

```typescript
public async addEmployeeCalendarEvent (employeeId: string, event: CalendarEvent) {
    const employee = this.employees.get(employeeId)
    // This is the rest wrapper around fetch used in pikku to minimize boilerplate
    const events = patch<CalendarEvents>(`api/employee/${employeeId}/addEvent`, event)
    this.employees.set(employeeId, {
        ...employee,
        events
    })
    // We don't emit the employee changed event here to prevent having all the render 
    // events triggered.
    this.emit(`${EmployeeServiceEvents.EVENTS_CHANGED}_${employeeId}`, events)
}
```

Alright, so the hook itself:

```typescript
import EventEmitter from 'eventemitter3'
import { useEffect } from 'react'

// The service, the event and a callback
export const useServiceHook = (service: EventEmitter, event: string, callback: (...args: any[]) => void) => {
  useEffect(() => {
    service.on(event, callback)
    return () => {
      service.off(event, callback)
    }
  }, [service, event, callback])
}
```

And you can use it by saying:

```typescript
import { useServiceHook } from '@pikku/hooks/dist/use-service-hook'
import { useState } from 'react'

const useEmployee = (employeeId?: string): Employee | undefined => {
    const [employee, setEmployee] = useState<Employee | undefined>(
        // This is why getEmployee has to be sync
        () => employeeId ? employeeService.getEmployee(employeeId) : undefined
    )
    useServiceHook(
        employeeService, 
        `${EmployeeServiceEvents.EMPLOYEE_CHANGE}_${employeeId}`, 
        setEmployee
    )
    return employee
}
```

or if you want to update something:

```typescript
const addCalendarEvent = (employeeId? string) => {
    return useCallback(async (event: CalendarEvent) => {
        if (employeeId) {
            await employeeService.addCalendarEvent(employeeId, event)
        }
    }, [employeeId])
}
```

And that's all folks!

Let us revisit the requirements:

##### 1: It has to be super typescript friendly
##### 2: It has to be React agnostic
##### 3: It has to be unit testable

> All of the above is achieved by just using normal ES6 classes.

##### 4: It has to support both `sync` and `async` methods 

> Using ES6 classes this works. The main obstacle is just that anything that needs to be initialised in a `getState` method can't be async because otherwise, the state would contain a promise. So you call the method if it's undefined expect the event to be called with the initial value shortly after

##### 5: It has to have no dependencies

> I had to use another EventEmitter library because the one included in the shim isn't browser
friendly. So the only dependency is EventEmitter3

##### 6: React: has to be performant and only update what and when I want it to

> So I have used this pattern for three applications so far. I can say it has made debugging CPU consumption much easier because the stack trace is minimal. I'm currently developing a large audiobook editor in-browser and it has so far held up to all my expectations without any debugging

##### 7: React: has to be super easy to use

> Not that much to learn thankfully, everything is pretty much contained in those lines of code above.

##### 8: Passing reference to it should be simple

> So the classes themselves are created once using `useMemo` and can then be passed through via a context or using props. Either way, it should never trigger a rerender unless the service itself changes, which is a whole different story.

```tsx
const employeeService = useMemo(() => new EmployeeService())
return <EmployeeContent.Provider value={employeeService}>
</EmployeeContent.Provider>
```

I am a bit lazy and just use singletons when possible. Saves me from having to use contexts across the board.

##### 9: Should be easy to create sub-states. A state per component for example.

> This was important for me because I have classes that back certain complex components in react. Because of the approach above, there's no complex state creation. Create the class and it deletes when the component is removed. If the class needs cleanup code you can just `useEffect`.

#### The end

I hope this was an enjoyable read! This website is a work in the process alongside the projects that depend
on pikku. I'm looking forward to sharing some of the libraries and thoughts there along the way.