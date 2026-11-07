# Magat Portfolio: XAMPP and hosting guide

This folder is the full portfolio site as plain files (HTML, CSS, JavaScript, images, fonts and PDFs). It needs no database and no build step. All links are relative, so it works from any folder.

The live version is at https://headless-cuvtksyqkvs-christamagat50107-1411.wix-site-host.com/

## 1. Run it on XAMPP (step by step)

1. Install XAMPP from https://www.apachefriends.org and open the XAMPP Control Panel.
2. Click Start next to Apache. MySQL is not needed.
3. Unzip magat-portfolio.zip. You get one folder named magat-portfolio.
4. Copy that folder into the htdocs folder. On Windows this is usually C:\xampp\htdocs\. On macOS it is /Applications/XAMPP/htdocs/. On Linux it is /opt/lampp/htdocs/.
5. Open http://localhost/magat-portfolio/ in your browser. The home page opens.
6. Check the other pages from the menu: About, Skills, Projects, the SQL sandbox, the pet game and Certificates.

### If something does not work

- The page says "Not found": the folder is not directly inside htdocs, or its name differs from the address. The address must match the folder name.
- Apache will not start: another program uses port 80. Close Skype or IIS, or change the port in XAMPP (Config, then Service and Port Settings). Then use http://localhost:8080/magat-portfolio/.
- Styles look old after an edit: press Ctrl+F5 (Cmd+Shift+R on Mac) to reload without the cache.
- Double-clicking index.html also shows the pages, but fonts are more reliable through http://localhost/.

## 2. Put it online

- The live Wix address above is already online. Symphony publishes updates there, so ask Symphony for a change and it goes live on that address.
- GitHub Pages (free): create a repository, upload the contents of the magat-portfolio folder to it, then turn on Pages in the repository settings. The address is https://cbmagazine.github.io/magat-portfolio/ (GitHub Pages is already on for the main branch). Links are relative, so this works.
- Netlify (free): drag the magat-portfolio folder onto https://app.netlify.com/drop. You get an address right away.
- Any web host: upload the folder contents to its public folder (often public_html) with FTP.

## 3. Folder structure

    magat-portfolio/
      index.html                  Home
      about.html                  About me, What I Bring
      skills.html                 What I Work With, What I Want to Learn Next
      projects.html               The four projects
      multimedia-project.html     Multimedia portfolio screenshot and link
      tamagotchi-project.html     Pet game, plays in the browser
      sql-sandbox.html            SQL editor, runs in the browser
      cisco-certificate.html      Certificates and badges
      privacy.html                Privacy
      css/styles.6973180f.css     All styles
      js/site.3ba1c292.js         Menu and small effects
      js/sql-sandbox.d8642406.js  SQL sandbox
      js/tamagotchi.8da855b8.js   Pet game
      images/                     Photo, multimedia screenshot, illustrations, certificate preview, badge
      certificates/               Cisco certificate PDF and the badge image
      symphony-fonts/             Fonts, stored locally
      symphony-icon*.png / .svg   Site icons
      README.md                   This file
      .gitignore                  Files Git should skip
      .nojekyll                   Tells GitHub Pages to serve the files as they are

## 4. Important settings and notes

- Fonts: Bricolage Grotesque and IBM Plex Sans are stored in symphony-fonts, so no internet is needed for text.
- Needs internet: the "Open the multimedia portfolio" button (https://cbmagazine.wixsite.com/online-portfolio-mm), the GitHub buttons (https://github.com/cbmagazine and https://github.com/cbmagazine/magat-portfolio) and the "Built with Symphony.co" badge link.
- Base path: all links are relative, so the folder can have any name and sit in any subfolder. Do not add a leading slash to links.
- MIME types: Apache in XAMPP already serves .woff2, .svg, .pdf and .js correctly. On another server, make sure .woff2 is served as font/woff2.
- Caching: file names in css, js and symphony-fonts carry a code (for example styles.6973180f.css). If you edit a file and keep its name, force a refresh. If you rename it, update the link in each HTML file.
- Where to edit text: the words are in the HTML files. Open a page in a text editor and change the text between the tags. Keep the tags.
- Where to edit colours and sizes: css/styles.6973180f.css. The colours are near the top, under :root. The home name size is in the last blocks of the file.
- The multimedia page shows a screenshot of the online portfolio (images/mm-portfolio.jpg) and a button that opens the live portfolio. Replace that image file to change the screenshot.
- The SQL sandbox and the pet game run in the browser with the files in js/. They need no server software.
- The Symphony badge sits in the footer of every page. Keep it unless you move the site to your own host and choose to remove it.

## 5. Quick test list

- Open each page once at a desktop width and once at phone width (resize the browser or use the browser's device mode).
- On the SQL sandbox, run: SELECT * FROM students;
- On the pet game, choose a pet, give it a name and press a care button.
- On Certificates, open one PDF.

## 6. GitHub (repository and GitHub Pages)

The target repository is https://github.com/cbmagazine/magat-portfolio . This folder is repo-ready: index.html is at the root, and .gitignore and .nojekyll are already here. GitHub Pages serves it as it is.

The "Portfolio repository" button on the site links to this repository: https://github.com/cbmagazine/magat-portfolio .

### First push

1. Install Git from https://git-scm.com and sign in to GitHub.
2. On GitHub, create an empty repository named magat-portfolio under cbmagazine. Do not add a README or a license there.
3. Open a terminal inside the magat-portfolio folder (the one with index.html) and run:

        git init -b main
        git add .
        git commit -m "Add portfolio site"
        git remote add origin https://github.com/cbmagazine/magat-portfolio.git
        git push -u origin main

4. If Git asks you to sign in, use your GitHub account. If it asks for a password, use a personal access token from GitHub (Settings, Developer settings, Personal access tokens).

### Turn on GitHub Pages

1. In the repository, open Settings, then Pages.
2. Under Build and deployment, set Source to "Deploy from a branch".
3. Choose branch main and folder / (root), then Save.
4. Wait a minute or two. The site appears at https://cbmagazine.github.io/magat-portfolio/ (the pattern is https://USERNAME.github.io/REPOSITORY/).

### Later updates

    git add .
    git commit -m "Update portfolio"
    git push

Pages updates itself after each push. Press Ctrl+F5 to see the new version.

### Notes

- Keep the file names in css, js and symphony-fonts as they are. The pages link to them by name.
- The multimedia portfolio button, the GitHub buttons and the Symphony badge link need internet, also on GitHub Pages.
- The .gitignore skips system files, editor folders, logs and .zip files, so a ZIP of the site is never uploaded by mistake.
