/**
 * ASCII chameleon art data.
 * Each row is defined as a character string + a parallel color-code string.
 * The palette maps single-char codes to CSS color values.
 */

export const palette: Record<string, string> = {
  p: '#f472b6',   // pink body
  P: '#ec4899',   // hot pink (darker body)
  c: '#22d3ee',   // cyan highlights
  n: '#1e293b',   // navy outline
  l: '#c084fc',   // lilac
  w: '#ffffff',   // white (eyes)
  d: '#0f172a',   // dark navy (pupils)
  g: '#94a3b8',   // slate gray (branch/feet)
  t: '#a78bfa',   // tail purple
  s: '#fda4af',   // soft pink (belly)
  ' ': '',        // transparent
}

// art[i] = character string, colors[i] = color codes (same length)
// The chameleon faces right, with curled tail on left
export const art: string[] = [
  '                                             ',
  '                      @@@@@@@@               ',
  '                   @@@########@@@            ',
  '                 @@################@@         ',
  '               @@####################@@       ',
  '              @@######################@@      ',
  '             @########################@@      ',
  '            @@######  +------+  #######@@     ',
  '            @######  | (@@)  |  #######@@     ',
  '            @######  +------+  ########@@     ',
  '            @@#######################@@@@@@   ',
  '             @@####################@@   ..@@  ',
  '              @@##################@@   ....@@ ',
  '    @@@@@@     @@################@@   ......@@',
  '  @@......@@    @@#############@@     ......@@',
  ' @@........@@    @@##########@@      ......@@ ',
  '  @@......@@      @@########@@      .....@@   ',
  '   @@....@@        @@######@@      ....@@     ',
  '    @@@@@@          @@####@@     ...@@         ',
  '                     @@##@@   ..@@            ',
  '                      @@@@  .@@               ',
  '                    @@ @@ @@ @@               ',
  '                   @@  @@@@  @@               ',
  '              ================================',
]

export const colors: string[] = [
  '                                             ',
  '                      nnnnnnnn               ',
  '                   nnnppppppppnnn            ',
  '                 nnppppppppppppppppnn         ',
  '               nnppppppppppppppppppppnn       ',
  '              nnppppppppppppppppppppppnn      ',
  '             nppppppppppppppppppppppppnn      ',
  '            nnpppppp  cccccccc  pppppppnn     ',
  '            npppppp  cwwddwwcc  pppppppnn     ',
  '            npppppp  cccccccc  ppppppppnn     ',
  '            nnpppppppppppppppppppppppnnnnnn   ',
  '             nnppppppppppppppppppppnn   ssnn  ',
  '              nnppppppppppppppppppnn   ssssnn ',
  '    tttttt     nnppppppppppppppppnn   ssssssnn',
  '  ttlllllltt    nnpppppppppppppnn     ssssssnn',
  ' ttlllllllltt    nnppppppppppnn      ssssssnn ',
  '  ttlllllltt      nnppppppppnn      sssssnn   ',
  '   ttlllltt        nnppppppnn      ssssnn     ',
  '    tttttt          nnppppnn     sssnn         ',
  '                     nnppnn   ssnn            ',
  '                      nnnn  snn               ',
  '                    nn nn nn nn               ',
  '                   nn  nnnn  nn               ',
  '              gggggggggggggggggggggggggggggggg',
]
