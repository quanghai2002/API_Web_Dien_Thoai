import express from 'express';
import * as dotenv from "dotenv";
dotenv.config(); // must have
// authentication middleware
import checkToken from './authentication/auth.js';

import { userRoute, studentsRoute } from './routes/index.js';
import connect from './database/database.js';

const app = express();
app.use(checkToken); // khiêng bảo vệ

app.use(express.json());
const post = process.env.POST || 3000;


// route
app.use('/users', userRoute)
app.use('/students', studentsRoute)



app.get('/', (req, res) => {
    res.send('responsr from root route kk');

})






app.listen(post || 3000, async () => {
    await connect();
    console.log(`listening on port ${post}`);
});



