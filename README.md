# folderize
It simply places all the files into the given directory into its own folder
***This is a side project.***
***It is not production ready code***

## Why?
I store my favourites music on cloud so when I change phones - favourites are not lost

 - However to add music to favourites folder on cloud - it only uploads the file itself which makes sense . . .
 - But when I download it back to phone - files's album art is not displayed correctly as they are not contained in its own folder or have album `metadata` set against them

This script ***autonimizes*** the leborious task <br>**Simple.<br> Straight forward.**

## Step 1
run `node index.js` and follow the ***on-screen instructions***
**Enjoy!**

## Bugs
If a `filename` has spaces before the extension than Node.js `fs` does not like it.
For example:

 - THIS IS AN EXAMPLE BUGGY NAME` `.MP3

Notice the extra ` ` space before `.mp3` file extenstion
<br>This space needs to be `trimmed` before it can be `folderized`