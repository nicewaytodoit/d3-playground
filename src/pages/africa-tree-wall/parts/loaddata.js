var promises = [];
promises.push(d3.json("./data/africa.topojson"))
promises.push(d3.csv("./data/data.csv"))

Promise
    .all(promises)
    .then(createMap)
    .catch((err) => {
        console.log('------->', err);
    });

