# Better Browser Start-Page

Have you ever thought that the browser start page is kind of useless? Do you frequently search for links while working? This project aims to solve that problem by providing a more functional and customizable start page.

The idea is to have a page where you can:

- Instantly start searching on your favorite search engines and apps
- Access a collection of apps and websites you use frequently
- Store and organize your links in a central place

## Functionality and Features

![Light Mode Screenshot](./docs/light-mode-screenshot.png)
![Dark Mode Screenshot](./docs/dark-mode-screenshot.png)

This app is divided into the following sections:

- **Search:** A configurable search section where you can choose your preferred search engine or website and search directly. You can customize it with any search engine or website that supports search functionality.
- **Apps:** A collection of your favorite websites or apps, such as YouTube and Spotify. It automatically detects and displays their favicons. This section is fully customizable.
- **Links:** A space to store and organize all your important links. Links can be grouped into collections with custom titles, and favicons are also displayed automatically.

The app supports both dark and light modes.

## Setup

1. Clone the repository.
2. Run `npm install`.
3. Got to the `/src/config` directory copy each file and remove the `example.` prefix, e.g. copy `example.apps.json` and name the name file `apps.json`
4. Verify the site renders by opening [http://localhost:5173](http://localhost:5173) in your browser. Initially, only the background and header will be visible, as the sections are not yet configured.
5. Configure the app (see the "Configuration" section for instructions).
6. Run `npm run build`.
7. Navigate to the `dist` folder and copy the full path to the `index.html` file (e.g., `/Users/<YourUser>/git/better-browser-start-page/dist/index.html`).
8. Replace your browser's default start page URL with the copied path. Instructions for specific browsers are provided below.

> **Note:** If you update the configuration, you need to run `npm run build`. However you don't need to redo all the other steps.

### Browser Setup Instructions

#### Chrome

1. Open Chrome settings.
2. Navigate to "On startup" and select "Open a specific page or set of pages."
3. Add the path to the `index.html` file you copied.

#### Firefox

1. Open Firefox settings.
2. Go to "Home" and set "Homepage and new windows" to "Custom URLs."
3. Add the path to the `index.html` file.

#### Safari

1. Open Safari preferences.
2. Go to the "General" tab and set the "Homepage" field to the path to the `index.html` file.

## Configuration

> **INFO:** You can find example by viewing the `example.*.json` file in the `/src/config` directory.

The app can be fully customized using JSON files. The configuration is straightforward and quick. This guide explains how to set up each section.

> **NOTE:** A future update will include a UI to simplify configuration.

### Directory

Place all configs in the `./src/config` directory.

### Search Section

1. Create a file named `search.json` in the `./src/config` directory.
2. Add the following JSON structure:

```json
{
  "elements": []
}
```

3. Populate the `elements` array with your search engine URLs. Use the `{query}` placeholder for the search term.

Example:

```json
{
  "elements": [
    {
      "name": "Google",
      "url": "https://www.google.com/search?q={query}"
    }
  ]
}
```

4. If the favicon is not displayed properly or you want a different logo to be displayed you can customize it with the `customLogoUrl` property:

```json
{
  "elements": [
    {
      "name": "Google",
      "url": "https://www.google.com/search?q={query}",
      "customLogoUrl": "..."
    }
  ]
}
```

#### Common Search URLs

- Google: `https://www.google.com/search?q={query}`
- YouTube: `https://www.youtube.com/results?search_query={query}`
- Amazon: `https://www.amazon.com/s?k={query}`
- Yahoo: `https://search.yahoo.com/search?p={query}`
- Bing: `https://www.bing.com/search?q={query}`
- DuckDuckGo: `https://duckduckgo.com/?q={query}`
- Reddit: `https://www.reddit.com/search/?q={query}`
- X (Twitter): `https://twitter.com/search?q={query}`
- GitHub: `https://github.com/search?q={query}`
- GitLab: `https://gitlab.com/search?search={query}`

### Apps Section

1. Create a file named `apps.json` in the `./src/config` directory.
2. Add the following JSON structure:

```json
{
  "collection": []
}
```

3. Populate the `elements` array with your links:

```json
{
  "elements": [
    {
      "url": "https://www.youtube.com/"
    },
    {
      "url": "https://open.spotify.com/"
    }
  ]
}
```

4. If the favicon is not displayed properly or you want a different logo to be displayed you can customize it with the `customLogoUrl` property:

```json
{
  "elements": [
    {
      "url": "https://calendar.google.com/",
      "customLogoUrl": "https://calendar.google.com/googlecalendar/images/favicons_2020q4/calendar_31_256.ico"
    }
  ]
}
```

### Links Section

1. Create a file named `links.json` in the `./src/config` directory.
2. Add the following JSON structure:

```json
{
  "collections": []
}
```

3. Add a new collection:

```json
{
  "collections": [
    {
      "title": "Your custom title",
      "elements": []
    }
  ]
}
```

4. Populate the `elements` array of your collection with your links:

```json
{
  "collections": [
    {
      "title": "Your custom title",
      "elements": [
        {
          "name": "W3 A11Y Guide",
          "url": "https://www.w3.org/WAI/ARIA/apg/patterns/"
        }
      ]
    }
  ]
}
```

5. If the favicon is not displayed properly or you want a different logo to be displayed you can customize it with the `customLogoUrl` property:

```json
{
  "collections": [
    {
      "title": "Your custom title",
      "elements": [
        {
          "name": "W3 A11Y Guide",
          "url": "https://www.w3.org/WAI/ARIA/apg/patterns/",
          "customLogoUrl": "..."
        }
      ]
    }
  ]
}
```

#### Dynamic Links

Links support variables. I use them because the subdomain of the test system
in my company frequently changes and I have a lot of links related to it.
I do not want to change all of the links every two weeks. Here is how you use them:

```json
{
  "variables": {
    "testSystemSubdomain": "system11-747"
  }
  "collections": [
    {
      "title": "Test Links",
      "elements": [
        {
          "name": "Test System Admin Panel",
          "url": "https://{testSystemSubdomain}.some-random-company.com",
        }
      ]
    }
  ]
}
```

Make sure to include a placeholder, like `{variableName}` in your link. The component will detect placeholder automatically and populates them.

## Development

Before starting development, follow the setup and configuration guides. Below are additional resources and instructions for developers.

### Important Commands

- Start Dev Server (http://localhost:5173): `npm run dev`
- Create a production build: `npm run build`
- Lint code: `npm run lint`
- Auto-fix linting issues: `npm run lint:fix`
- Preview production build: `npm run preview`

### Development Stack

- **Bundler:** [Vite](https://vite.dev/) with [vite-plugin-singlefile](https://www.npmjs.com/package/vite-plugin-singlefile), so the production build does not need a webserver like nginx to run it
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Frontend Framework:** [React](https://react.dev/)
- **UI Library:** [Shadcn](https://ui.shadcn.com/) (based on [RadixUI](https://www.radix-ui.com/))
- **CSS Framework:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide](https://lucide.dev/)

### Project Structure

- **/docs**: Documentation assets (e.g., screenshots).
- **/public**: Static files (e.g., images).
- **/src**: Application source code.
  - **/components**: Reusable React components.
    - **/custom**: Custom components that are specific to this project.
    - **/ui**: Pre-built components from the Shadcn library. These are auto-generated and some where customized as needed. Read the Shadcn docs to learn how to install more. Do not overwrite existing components here.
  - **/config**: Directory for JSON configuration files that define the app's customizable content (e.g., search engines, apps, links).
  - **/context**: React contexts that load JSON configuration data and provide it to components using `useContext`. Each major section (Search, Apps, Links) has its own dedicated context.
  - **/lib**: Utility functions shared across the app. Examples include helper functions for parsing JSON or managing themes.
  - **App.tsx**: The main application file. It defines the overall structure of the app, including the header and main content areas, and integrates contexts for configuration.
  - **index.css**: Contains global CSS styles, including theme variables. The theme structure is based on Shadcn's predefined design system. Customization instructions are available in their [theming guide](https://ui.shadcn.com/docs/theming).
  - **main.tsx**: The entry point for the application. It initializes React and renders the app into the DOM.

## Contributions

Contributions are welcome!
Also let me know if you find any bugs and if you have any feature requests or other suggestions.

To get started with contributing:

1. For bigger changes: Open an issue to discuss your ideas first. You can also pick one of the existing ones.
2. Fork the repository
3. Create a feature branch
4. Commit your changes with clear messages
5. Submit a pull request

Please ensure your code passes linting and adheres to the project structure.

Enjoy your customized browser start page!
