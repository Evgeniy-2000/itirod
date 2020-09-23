let Error404 = {
    render: async () => {
        return `
        <!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Page Not Found</title>
    <link rel="stylesheet" href="styles.css" type="text/css">
  </head>
  <body>
    <div id="message">
      <h2>404</h2>
      <h1>Page Not Found</h1>
      <p>Please check the URL for mistakes and try again.</p>
    </div>
  </body>
</html>

        `
    },

    afterRender: async () => {

    }
};

export default Error404;