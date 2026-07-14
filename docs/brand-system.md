# Tekton web brand system

The web palette is derived from the supplied artwork rather than replacing it. The original navy `#0F395C` remains the anchor. The two supplied oranges (`#FB7E16` and `#FC6F08`) are balanced into `#FB7610`, retaining their hue while avoiding competing accent shades.

## Semantic palette

| Token | Value | Role |
| --- | --- | --- |
| Navy deep | `#071F33` | Dark sections and footer |
| Navy | `#0F395C` | Brand anchor and navigation text |
| Navy soft | `#1D557D` | Supporting blue |
| Orange | `#FB7610` | CTA and interaction accent |
| Orange dark | `#C94B00` | Accessible accent text on light surfaces |
| Surface | `#F4F7F8` | Cool neutral background |

## Contrast verification

- Original navy on white: `11.93:1`
- Original navy on supplied orange: `4.60:1`
- Deep navy on refined orange: `5.30:1`
- White on refined orange is intentionally avoided for normal text because it does not meet WCAG AA.

The interface uses the 60/30/10 distribution: light and navy surfaces dominate, with orange reserved for calls to action, focus, and active state.
