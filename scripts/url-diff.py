import subprocess,re,os,sys,json
REV='e8189f9'
def sh(*a): return subprocess.run(a,capture_output=True,text=True).stdout
files=sh('git','ls-tree','-r','--name-only',REV).split('\n')
def fm(path):
    t=sh('git','show',f'{REV}:{path}')
    m=re.match(r'---\n(.*?)\n---',t,re.S); d={}
    if m:
        for l in m.group(1).split('\n'):
            k=re.match(r'(\w+):\s*(.*)',l)
            if k: d[k.group(1)]=k.group(2).strip().strip('"\'')
    return d
old=set()
for f in files:
    m=re.match(r'docs/(.*)\.mdx?$',f)
    if m:
        p=m.group(1); d=fm(f)
        if p.endswith('/index'): p=p[:-6]
        elif p=='index': p=''
        if 'slug' in d:
            s=d['slug']; p=s.strip('/') if s.startswith('/') else os.path.join(os.path.dirname(f[5:]),s).strip('/')
        old.add('/docs'+('/'+p if p else ''))
    m=re.match(r'blog/(\d{4})-(\d\d)-(\d\d)-(.*)\.mdx?$',f)
    if m:
        d=fm(f); slug=d.get('slug',m.group(4))
        old.add(f'/blog/{m.group(1)}/{m.group(2)}/{m.group(3)}/{slug}')
    m=re.match(r'src/pages/(.*)\.tsx$',f)
    if m and 'module' not in f:
        p=m.group(1); old.add('/'+('' if p=='index' else p))
old|={'/blog'}
def exists(u):
    b='dist/client'+u
    return os.path.exists(b+'/index.html') or os.path.exists(b+'.html')
miss=sorted(u for u in old if not exists(u))
print(len(old),'old urls;',len(miss),'missing')
json.dump(miss,open('/tmp/missing.json','w'))
print('\n'.join(miss))
