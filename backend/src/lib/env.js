import dotenv from 'dotenv'

dotenv.config("backend/.env");

const ENV = {
    
    "port" : process.env.PORT,
    "db_url" : process.env.DB_URL

};

export default ENV;
