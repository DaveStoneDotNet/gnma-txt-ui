# DEVELOPER README

September 2018

```npm run start```

---
BUGS
---


---

JAN 2019 TODO

List the number of files
Highlight Large Files (define large file)
Track down constants - e.g. Max File size (see 'getHideLoansForLargeFiles' in 'GnmaTxtFilePage') and Sorting - e.g. (see 'sortFields' in 'LoadGnmaTxtFile')

---

Filter/Find Values
Filter/Find Fields
Request File Creation
Post File
Large File Handling

Click outside modal to close

Number of Loans
File Info (e.g. Size AFTER selection)


---
DONE
---
File Path from Config
CLEAR on LOAD FILE
CLEAR Hide Loan selection on click
CLEAR Hide Loan selection on Record Level selection
Remove INDEX data access
Exclude files that contain 'ISSUES'
Shared Folder Location
ENTER Key on Field Value Edits


---


All packages updated to latest version January 2019.

**API NOTE**

Currently connecting to a 'generic' api at ```C:\DATA\clones\Cooper.Trace.Management\Cooper.Trace.Management```

The URL to this api is configured in the ```.env.development``` file in the root folder.

```
    REACT_APP_CMA_API=http://localhost:57367/api/cma/
```

If ```Cooper.Trace.Management``` is not running (e.g. via Visual Studio), then the footer should indicate a connection exception. This api is not special and is essentially intended to provide examples for connecting to an api and experiment with ways to handle being disconnected from the remote api and/or individual api method call failures.

Currently, the api contains some rather generic methods:

```
    GetData()         returns { Data: "SERVER DATA" }
    GetLookups()      returns { Data: "LOOKUP DATA" }
    GetConfig()       returns { Data: "CONFIG DATA" }
    GetUser()         returns { Data: "USER   DATA" }

    PostData({ Data: "...whatever..." }) 

                      returns { Data: $"{request.Data} REFLECTED FROM THE SERVER" }
```

---

## The initial entry point of this React app is:

```
    \public\index.html
    \index.js
```

Webpack scripts are executed from ```npm``` in a command prompt via ```scripts``` defined in the ```package.json``` file. For example:

```
    npm run build

...or...

    npm start
```



```
    "scripts": {
                   ...
                   "build":    "node scripts/build.js",
                   "start-js": "node scripts/start.js",
                   "start":    "npm-run-all -p watch-css start-js",
                   ...
               },
```

The ```npm``` commands execute webpack scripts located in the ```scripts``` folder at...

```
    \scripts\build.js
    \scripst\start.js
```

... which perform all the complexities of bundling, watching, and deploying files via webpack.

Notably, a bundled version of all the javascript files (including the ```index.js``` entry point) is injected as the last element of the ```<body>``` of the ```index.html``` file. 

>*All the mechanics of WebPack is an extreme topic on its own. Rather than veer off into all the complexities of WebPack here, we will leave some of the mysteries of WebPack unexplained in order to focus on React.*

This injection of the ```bundle.js``` file into the ```index.html``` file would then look similar to the following:

```
<html>
    <body>

        <div id='root'>...</div>

        <script type="text/javascript" src="/static/js/bundle.js"></script>

    </body>
</html>

```

When the ```index.html``` file is loaded in the browser and the ```bundle.js``` script starts executing, the entry point of ```index.js``` kicks in with code similar to the code shown below. This code can vary, however, note the ```document.getElementById('root')```...

```
    runWithAdal(authContext, () => {
            ReactDOM.render(<Provider store = { store }><BrowserRouter><App /></BrowserRouter></Provider>, document.getElementById('root'))
            registerServiceWorker()
        }
    )

```

The ```document.getElementById('root')``` matches the ```<div id='root'>``` defined in the ```index.html``` file and uses this to create the React app.

The other 'wrapper' elements (e.g. ```runWithAdal, Provider, BrowserRouter```) may vary depending on other application-wide packages or frameworks required by any specific application. For example, this application uses authentication and is wrapped with ```runWithAdal``` as well as 'Redux' wrapped with a ```Provider``` and ```store```.

The entry-point for a React app can sometimes be confusing. The interaction between WebPack, the ```index.js``` file and the ```index.html``` file is not immediately intuitive and requires some explanation. And while ```index.js``` might be thought of as the entry-point for *loading* the React app, ```index.js``` is not the actual entry-point ```component``` displayed in the UI. This *secondary* entry-point is ```App.js``` located in the root folder and this is the main, top-level component referenced and 'injected' in the ```index.js``` file.


```
    import App from './App'
    
    ...ReactDOM.render(...<App />..., document.getElementById('root'))

```

Sometimes it's easy to forget what these top-level entry points represent. ```index.js``` could be thought of as representing the main, top-level application entry-point for configuring things such as routing, authentication, and state (e.g. Redux). Whereas ```App.js``` is the secondary, top-level entry point for beginning to shape the actual ```HTML``` components of the application. While ```App.js``` might be considered the top-level entry-point for the HTML, it's not the actual top-level entry-point of the HTML *```page```*. It's the top-level entry-point of the HTML *```element```* inserted as a child of the user-defined 'root' element defined by:

```
    document.getElementById('root')
```
More detailed information below, most notably ```Authentication Scenarios for Azure AD```.

# FOUC - Flash of Unstyled Content

To prevent FOUC, the following has been added to the 'index.html' page in the 'public' folder:

```css
    <style>
        #root { display: none; }
    </style>

```

Then - at the very bottom of the 'site.scss' file, the css above is overridden by the css below:

```css
        #root { display: block; }

```

This implementation keeps everything hidden until all the css has been loaded into the browser.


# DARK/LIGHT THEMING

Implemented in:

```
    \components\common\BodyTag.js
```

The `BodyTag` component doesn't render any html. Instead, it has a reference to `document.body` via javascript. An `isDark` boolean is passed down via props and when the value changes, it sets the `className` of the `document.body` to `dark` or `light` accordingly:

```
    if (props.isDark) {
        document.body.className = 'dark'
    } else {
        document.body.className = 'light'
    }

```

The `BodyTag` component is then 'rendered' in the top-level `App.js` file:

```jsx
    render() {

        const { isDark } = this.state
        . . .

        return (
                <div id="app">

                    <BodyTag isDark={ isDark } />
                    <NavBar onThemeChanged={ this.onThemeChanged } ... isDark={isDark} ... />
                    . . . 

```

A theme changed handler defined in `App.js` is passed down to a `NavBar` component to allow a user to switch themes:

```js
    onThemeChanged = () => {

        this.setState({ isDark: !this.state.isDark })
    }

```

When a user makes a selection from the dropdown in the `NavBar`, the handler in `App.js` is envoked to change the state of the `isDark` value passed down to the `BodyTag` which in turn changes the `className` of the `document.body` for the rendered HTML file.

```html
    <DropdownItem onClick={ onThemeChanged }>{ themeName }</DropdownItem>
```
Finally, the `\scss\site.scss` file contains `dark` and `light` css versions which cascades down through the html:

```css

    .dark {
        ...
    }
    
    .light {
        ...
    }

```

# CREATE REACT APP README


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
