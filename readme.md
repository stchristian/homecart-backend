Homecart backend
=
You will need NodeJs v12 to run this project.

### Inside project directory 
To install all dependencies:
```
npm i
```
Run dev server:
```
npm run dev
```

### Important
To run this project you must specify environment variables. You can find which env variables needed in _src/@types/index.d.ts_
Variables prefixed with SEED are used for the initial data seed. 
If you want to test the API, I highly recommend this [URL](https://homecart-backend.herokuapp.com/). The insonmia requests goes to this URL.

### Insomnia
You can use [Insomnia](https://insomnia.rest/) (insead of graphqli) to send graphql request with the authorization headers. Sample queries are added to the project so you can import them to Insomnia (_insomnia.json_).