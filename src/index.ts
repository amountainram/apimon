import {app} from "./routes"

const port = 5000

app.listen(port, () => {
  console.log(`apimon app listening on port ${port}`)
})
