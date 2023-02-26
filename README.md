# front-end-img-reco-url-shortner
Front End URL SHORTNER

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Features 

- Upload image public
- Sign in
- Sign up
- Public list images
- Personal space ( List user's images (public or private) / manage profil / logout)

## Requirements
- 

## Libraires
- [ReactJS - latest (CRA)](https://reactjs.org/)
- [ReactRouter](https://reactrouter.com/en/main)
- [react-plock](https://github.com/itsrennyman/react-plock)

## Technical informations

This project use node v14.17.3, and AWS Apmlify

## Requirements ENV 

    s3: {
        REGION: process.env.REACT_APP_REGION,
        BUCKET: process.env.REACT_APP_BUCKET,
    },
    apiGateway: {
        REGION: process.env.REACT_APP_REGION,
        URL: process.env.REACT_APP_API_URL,
    },
    cognito: {
        REGION: process.env.REACT_APP_REGION,
        USER_POOL_ID: process.env.REACT_APP_USER_POOL_ID,
        APP_CLIENT_ID: process.env.REACT_APP_USER_POOL_CLIENT_ID,
        IDENTITY_POOL_ID: process.env.REACT_APP_IDENTITY_POOL_ID,
    },
