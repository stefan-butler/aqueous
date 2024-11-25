import express from 'express'
import cors from 'cors'
import router from './routes';

const app = express();
const port: number = 3000; 

//middleware
app.use(cors())
app.use(express.json())

//use routes 
app.use( router)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})