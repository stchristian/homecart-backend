Homecart backend
=
You will need NodeJs to run this project.
### Download & install nvm
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
```
### Download & install node
```
nvm install 10.1.0
nvm use 10.1.0
```
### Inside project directory 
To install all dependencies:
```
npm i
```
Run dev server:
```
npm run start
```
Generate schema.json for apollo client (the server should be running when executing this command):
```
npm run schema
```

### Insomnia
You can use Insomnia (insead of graphqli) to send graphql request with the authorization headers. Sample queries are added to the project so you can import them.