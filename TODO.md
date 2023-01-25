# TODO

## Notes to remeber for future:

1. Move db & temp dir creation from DAO to main.
2. Utilise webpackPaths instead of hand written.
3. Check if this function `checkFileExistsSync() -> fs.accessSync` uses LTS modules and is not deprecated
4. Check if this function `createZipArchive() -> fs.truncateSync` uses LTS modules and is not deprecated
5. Restoring DB issue, figure out how to replace DB because once DB is removed new one is created and is linked to app. Which we cannot delete or replace. Either create a new electron app for this procedure or figure out another way to do so.
6. Save download url.
7. Send backup status and url to server database.
8. Figure out should we delete file `db_details.json` and create a new one for each upload or empty it.

## Development:

Add delete db
Add download zip
Extract db
Fix package name crud

## Production:

Add delete db
Add download zip
Extract db
Fix package name crud

### Registration:

1. username
2. password
3. phone
4. email
5. role
   a. Admin
   b. Cashier
   c. Developer

6. MFA enable
   a. Email
   b. Phone
7. register

### Login:

1. username
2. password
3. reset password
   a. Email
   b. Phone
4. keep logged-in
5. login

### Process:

1. save data -> registration
2. check if username exixts & password matches
