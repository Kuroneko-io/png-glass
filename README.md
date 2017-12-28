# PNG Glass
A PNG transparency optimizer

## Installation

Install it with npm

```npm install png-glass```

or with yarn

```yarn add png-glass```

## Usage

```pngGlass({in: 'in.png', out: 'out.png' })```

### Options

#### in
The input file.
- Default: in.png
- Type: Readable stream, Buffer, Path, String

#### out
The output file.
- Default: out.png
- Type: Writable stream, Path, String

#### optipng
Should ompress the image with optipng.
- Default: true
- Type: boolean

## Why

alphaPNG images works by adding a transparency layer in the top of the original png image.

In such images, some parts could be completely transparent and the original image colors will not be visible to the user.

But unfortunately, the PNG compression won't be able to optimize that behavior.

PNG Glass cleans your PNG by converting every 100% transparent pixel to a unique color, which helps the PNG algorithm to compress better the file.
