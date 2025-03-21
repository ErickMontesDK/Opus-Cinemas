# Installation

## 1-Clone the repository

Clone this repository to your device

```bash
git clone https://github.com/ErickMontesDK/Opus-Cinemas.git
```
Then, navigate into the proyect folder

```bash
cd Opus-Cinemas
```

---

## 2-Add your .env file

You need to create a .env file with the variables required to connect to your Supabase project and with the third-party API [MovieGlu](https://movieglu.com/).
The file should follow this structure:

```.env 
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
DATABASE_URL=your_database_url

MOVIEGLU_APIKEY=your_movieglu_apikey
MOVIEGLU_AUTH=your_movieglu_auth
MOVIEGLU_TERRITORY=your_movieglu_territory
MOVIEGLU_GEOLOCATION=your_movieglu_geolocation
```
- **SUPABASE_URL and SUPABASE_KEY**: These are your Supabase project credentials. You can get these values in the Supabase dashboard under *Project Settings > Data API*.
- **DATABASE_URL**: This is the connection URL for your Supabase database. You can find it at the top of the Dashboord, click on *Connect*, and look for the *Connection String* under the *Transaction pooler* section.
  - **Important**: You need to add your database password to your connection string. If you have forgotten it, you can reset a new one in the dasboard, under *Project Settings > Database* 
- **MOVIEGLU_APIKEY, MOVIEGLU_AUTH, MOVIEGLU_TERRITORY, MOVIEGLU_GEOLOCATION**: These are your MovieGlu credentials. Once you sign up in their page, you'll get an email with your own credentials.

---

## 3-Install dependencies

Install the required dependencies by running the command:
```bash
npm install
```

---

## 4-Set Up the Database

To create the necessary tables and functions in your Supabase database, run the following command:

```bash
node migrations/createSupabaseElements.js
```
This script reads the SQL file *initialMigration.sql* and executes the content in your Supabase database. After running the script, your database will be ready to use.

---

## 5-Run the project

### 5a-Run the project locally

You can start a local server of the project using Netlify Cli, you just have to run the command:
```bash
npx netlify dev
```
Once the process is over, the project will be available at your localhost `http:localhost:8888`

---

### 5b-Deploy to Netlify

If you want to deploy the project to a Netlify server instead of running it locally, you need to follow a few extra steps:

1-Push the code into your Github repository

2-Link your repository to Netlify
  - Go to your Netlify dashboard and create a **New site from Git**
  - Link your Github account
  - Select your repository and the branch that you want to deploy


3-Configure your enviroment variables
  - In Netlify project dashboard, go to *Site configuration > Enviroment variables*
  - Add the same variables you configured in your .env file
4-Deployment
  - Netlify will automatically deploy the project when you push changes to the selected branch  

