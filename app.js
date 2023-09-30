const express = require("express");
const { open } = require("sqlite");
const path = require("path");
const sqlite3 = require("sqlite3");
const dbPath = path.join(__dirname, "covid19India.db");
const app = express();
let db = null;
const initializeDbAndResponse = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server is running http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error:${e.message}`);
    process.item(1);
  }
};
initializeDbAndResponse();

const convertDbToResponse = (dbObject) => {
  return {
    state_id: dbObject.state_id,
    state_name: dbObject.state_name,
    population: dbObject.population,
  };
};
app.get("/states/", async (request, response) => {
  const getStateQuery = `SELECT * FROM state;`;
  const stateArray = await db.all(getStateQuery);
  response.send(
    stateArray.map((eachItem) => console.log(convertDbToResponse(eachItem)))
  );
});
app.get("/states/stateId/", async (request, response) => {
  const { stateId } = request.params;
  const getAStateQuery = `SELECT * FROM state WHERE state_id=${stateId};`;
  const state = await db.get(getAStateQuery);
  response.send(convertDbToResponse(state));
});
app.post("district/", async (request, response) => {
  const { districtName, stateId, cases, cured, active, death } = request.body;
  const postDistrictQuery = `INSERT INTO
        district(district_name,state_id,cases,cured,active,death)
    VALUES
        (${districtName},${stateId},${cases},${cured},${active},${death};`;
  const district = await db.run(postDistrictQuery);
  response.send("District Successfully Added");
});
