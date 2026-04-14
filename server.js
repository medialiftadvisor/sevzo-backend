const app = require('./api/server');

const PORT = process.env.PORT || 5000;
module.exports = app;   
if (require.main === module) {
app.listen(PORT, () => {
  console.log(`Server is running live on http://localhost:${PORT}`);
});
}