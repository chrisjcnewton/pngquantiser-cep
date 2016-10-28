# PNG Quantiser - A Photoshop Add-on
[PNG Quantiser](http://chrisjcnewton.github.io/pngquantiser-cep/) Add-on for Photoshop CC 2014 and higher

This Add-on allows the creation of 8-bit quantised PNGs which can create much smaller (~75%) transparent PNGs than is capable with the normal save for web exporter.
This Add-on is compatible with `Photoshop CC 2014` and higher.

## Technology
The Add-on has been created using the Adobe Common Extensibility Platform (CEP).
Under the hood it uses the [pngquant](https://pngquant.org/) Library which can create 8-bit PNGs with alpha transparency at vastly smaller file sizes.
It is based heavily on [ImageAlpha](https://pngmini.com/) which is a standalone mac app with similar functionality. This Add-on brings that functionality into Photoshop on both platforms.

## Installation

### Installation for CC 2014
Download a zip or clone the repository.
Navigate to the build folder and locate the `pngquantiser.zxp` file.
Double click on the `zxp` file and `Adobe Extension Manager` should launch and allow you to install the Add-on.
When asked `The publisher of the extension could not be verified... Are you sure you want to install this extension`. Click `Install`.

### Installation for CC 2015 and higher
As of CC 2015 Adobe has dropped support for `Adobe Extension Manager` in favour of installing via the Adobe Add-ons (https://creative.adobe.com/addons) site.
~~As this Add-on has not been published yet, the `zxp` needs to be installed manually.~~
The Add-on can be installed from the Adobe Add-ons site [here](https://creative.adobe.com/addons/products/14877#.VyHJJaMrIUE).

### Manual Installation for CC 2015 and higher
Download a zip or clone the repository.
Navigate to the build folder and locate the `pngquantiser.zxp` file.
The easiest method is to download a third-party tool called [ZXPInstaller](http://zxpinstaller.com/) and drag the `zxp` file onto the tool.

## How it works
Once installed the Add-on can be found in the 'Window' > 'Extensions' menu under the entry 'PNG Quantiser'.
Once the Add-on has been opened it can be docked in any pallete desired for future use.

- Open an image in Photoshop that you would like to save as a quantised PNG.
- Click on the 'Load Current Image' button in the Add-on.
- The image will now appear in the preview window in the Add-on.
- The zoom level can be adjusted by clicking on the appropriate buttons above the preview window. It can also be adjusted using the mouse wheel and clicking on the image with the mouse.
- The background colour of the preview window can be changed by clicking on the appropriate buttons below the preview window.
- The no of colours to quantise the image by can be changed by clicking on the appropriate buttons below the preview window. The amount of file size being saved can be seen in the file size details area.
- Once happy with the amount of compression the PNG file can be saved by clicking on the 'Save Quantised Image' button.
