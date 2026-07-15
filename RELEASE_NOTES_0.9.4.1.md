# PTF Studio Beta 0.9.4.1

This maintenance build corrects the Downscale & Import resampling pipeline.

## Fixed

- Replaced the previous fixed 4 × 4 bicubic sampler, which skipped source pixels during large reductions and could create jagged or distorted edges.
- Added an antialiased bicubic-smooth B-spline filter whose sampling radius expands according to the reduction ratio.
- Performs resizing in premultiplied-alpha space to preserve transparent borders and prevent dark or white edge halos.
- Keeps the complete source canvas and transparent padding; no trimming or visible-pixel cropping is performed.
- Forces high-quality smoothing in live preview rendering so imported icons are not displayed with nearest-neighbour scaling.

All exact-size Import behavior and PSP target dimensions remain unchanged.
