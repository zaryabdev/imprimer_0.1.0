Better SQLite 3 Docs [API](https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md)

https://github.com/WiseLibs/better-sqlite3/issues/224#issuecomment-460294690

You can use the v140 build tools by running this command:

npm i -g --prodution --vs2015 --add-python-to-path windows-build-tools node-gyp
If you're wondering how to make the installation work with the v150 tools, that's a question outside of my expertise. Hopefully someone with more knowledge of Windows can chime in.

I simply rely on node-gyp to work as advertised. To my knowledge, there's nothing about better-sqlite3 that's specific to unix or linux systems.

https://github.com/WiseLibs/better-sqlite3/issues/170#issuecomment-429596482

I'd say that's awesome but that's already what I'm telling people to do. At this point, it sounds like I should start releasing a batch file that does this because the command's starting to look like
npm i -g --prodution --vs2015 --add-python-to-path windows-build-tools node-gyp

Quite a mouthful.

Extract a .asar file
npx asar extract app.asar destfolder

logger pattern
https://stackoverflow.com/questions/9380785/node-js-winston-can-i-add-default-meta-data-to-all-log-messages

adm-zip sample
https://www.tabnine.com/code/javascript/functions/adm-zip/AdmZip/addLocalFolder
