const db = require('./db')

async function updateStats(user, giver, action) {
    try {

        /* Check If Valid Action */
        const actioncheck = await db.query(`SELECT ${action} FROM actions`)

        if (actioncheck[0] == undefined) {
            return "INVALID ACTION";
        }

        /* Check If Recieving User Exists */
        const usercheck = await db.query(`SELECT * FROM actions WHERE discord_id = '${user}'`)

        if (usercheck[0] == undefined) {
            await db.query(`INSERT INTO actions (discord_id) VALUES ('${user}')`)
        }

        /* Check If Giving User Exists */
        const givercheck = await db.query(`SELECT * FROM actions WHERE discord_id = '${giver}'`)

        if (givercheck[0] == undefined) {
            await db.query(`INSERT INTO actions (discord_id) VALUES ('${giver}')`)
        }

        /* Since Checks Are Done, Actually Update Action Count */
        const userstats = await db.query(`SELECT * FROM actions WHERE discord_id = '${user}'`)
        const giverstats = await db.query(`SELECT * FROM actions WHERE discord_id = '${giver}'`)

        // Handling Given Count

        const givencount = giverstats[0].given + 1
        await db.query(`UPDATE actions SET given = ${givencount} WHERE discord_id = '${giver}'`)
        
        // Handle Action Count
        let actioncount

        switch(action) {
            case "bark":
                actioncount = userstats[0].bark + 1;
            break;
            case "bite":
                actioncount = userstats[0].bite + 1;
            break;
            case "boop":
                actioncount = userstats[0].boop + 1;
            break;
            case "hug":
                actioncount = userstats[0].hug + 1;
            break;
            case "kiss":
                actioncount = userstats[0].kiss + 1;
            break;
            case "nuzzle":
                actioncount = userstats[0].nuzzle + 1;
            break;
            case "pet":
                actioncount = userstats[0].pet + 1;
            break;
            case "poke":
                actioncount = userstats[0].poke + 1;
            break;
            case "slap":
                actioncount = userstats[0].slap + 1;
            break;
            case "spank":
                actioncount = userstats[0].spank + 1;
            break;
        }

        await db.query(`UPDATE actions SET ${action} = ${actioncount} WHERE discord_id = '${user}'`)
    } catch (err) {
        console.log(err)
        return;
    }
}

async function fetchStats(user) {
    try {
        const data = await db.query(`SELECT * FROM actions WHERE discord_id = '${user}'`)

        return data;
    } catch (err) {
        console.log(err)
        return;
    }
}

const blacklistCache = new Map();

const CACHE_TTL = 60 * 60 * 1000;

async function checkBlacklist(id) {
  const cachedValue = blacklistCache.get(id);
  if (cachedValue && (Date.now() - cachedValue.timestamp) < CACHE_TTL) {
    return cachedValue.value;
  }

  const guild = await db.query(`SELECT * FROM blacklist WHERE guild_id = '${id}'`);

  const isBlacklisted = guild.length > 0;
  blacklistCache.set(id, { value: isBlacklisted, timestamp: Date.now() });

  return isBlacklisted;
}

setInterval(() => {
  for (const [key, value] of blacklistCache.entries()) {
    if ((Date.now() - value.timestamp) >= CACHE_TTL) {
      blacklistCache.delete(key);
    }
  }
}, CACHE_TTL);


module.exports = {
    updateStats,
    fetchStats,
    checkBlacklist
}