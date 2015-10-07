# ESG's Website

This repository houses the source code to the Engineering Student Government
website. If there is a problem with the website, please [raise an issue][]

The website is hosted on Nick Babcock's servers. Contact him at nbabcock19@hotmail.com
For any questions or concerns please contact the ESG Web Director at esg.webdirector@umich.edu

[raise an issue]: https://github.com/UM-ESG/esg/issues

## How to Build this Website

This section is for those who want to test the site on their local computer. If
you're only editing content please see the following section.

- Install [nodejs][]
- Install [gulp][]: `npm install -g gulp`
- Install dependencies: `npm install`
- Run `gulp`
- Navigate to newly created `bin` directory
- Serve the files using your favorite webserver. The easiest will probably be to
  install python. If python2 then `python -m SimpleHTTPServer 8000 .` else if
  python3 then `python -m http.server 8000 .`
- Point your browser to `http://localhost:8000/index.html`


[nodejs]: http://nodejs.org/download/
[gulp]: http://gulpjs.com/

## How to Add/Edit/Delete Pages

You don't need any coding knowledge whatsoever to add/edit/delete pages on the
ESG website. This section is for non-developers. If you're a developer then it
is expected for you to follow the github workflow, and not make changes to the
main code immediately, as any code changes will propogate live within a couple
minutes. I'll walk you through the hardest scenario -- adding a page.

1. Sign up for a Github account
1. Navigate to the [Content][] page
1. Click the "+" button next to "umec / content /" it will create a new file in
   the directory
1. Use dashes and preferably lower case letters in the title, eg:
   "why-umec-rules.md". Don't forget the ".md" extension!
1. Add your content in [markdown format][]
1. Once finished, fill out the textbox down below with reasons. Something
   simple like "Add page on why ESG rules" should be fine.
1. Click the green button and within a couple minutes your new file will be
   online! Simply navigate to the ESG homepage and append the title to the url.
   For example, if I had created the page "why-umec-rules.md", I would navigate to
   http://umec.engin.umich.edu/why-umec-rules.html to view it.
1. The next step would probably be making this page linked from another page so
   people can click on it and be directed to the new page. This is extremely easy,
   but I'll direct you to google. Essentially it is you just typing
   `<a href="/why-umec-rules.html">Click Me!</a>` on the html page you want to
   appear.

[Content]: https://github.com/UM-ESG/esg/tree/master/content
[markdown format]: https://help.github.com/articles/markdown-basics
