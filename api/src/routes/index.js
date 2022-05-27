const { Router } = require("express");
const axios = require("axios");
const { Character, Episode } = require("../db")
const router = Router();

const allCharactersApi = async (req, res) => {
    try {
        const getInfoApi = await axios.get(`https://rickandmortyapi.com/api/character`)
        let characterApi = getInfoApi.data.results.map((el) => {
            return {
                id: el.id,
                name: el.name,
                species: el.species,
                origin: el.origin.name,
                image: el.image,
                episode: el.episode
            }
        })
        return characterApi;

        console.log(characterApi)

    } catch (error) {
        console.log(error);
    }
}

const getAllEpisodes = async () => {
    let episodesApi = await axios.get(`https://rickandmortyapi.com/api/episode`)
    let episodeApi = await episodesApi.data.results.map((el) => {
        return {
            id: el.id,
            name: el.name,
        }
    })
    return episodeApi
}

const getAllInfo = async () => {
    let characterInfo = await allCharactersApi();
    let episodeInfo = await getAllEpisodes();
    let infoTotal = characterInfo.concat(episodeInfo);
    return infoTotal;

}
router.get("/characters", async (req, res) => {
    const charactersApi = await getAllInfo();
    res.json(charactersApi);
});

router.get("/episodes", async (req, res) => {
    const episodesApi = await getAllEpisodes();
        episodesApi.forEach(el => {
        Episode.findOrCreate({
            where: {name: el.name}
        })
      });
      const totalEpisodes = await Episode.findAll();
    res.json(totalEpisodes);

});
router.post("/character", async(req, res) =>{
    const { name, species, origin, image, episode} =req.body;
    const newCharacter = await Character.create({name, species, origin, image, episode })
    let episodebyCharacter = await Episode.findAll({
        where: {name: episode}
    })
newCharacter.addEpisode(episodebyCharacter);
return res.send("personaje creado exitosamente!") 
})
// consultar como arreglar el delete
router.delete("/character", async(req, res) =>{
    try{
        const {id} = req.params;
        res.json(await Character.destroy({
             where: {id} 
        }))
     } catch(error){
         res.send(error)
     }
       
})

// Configurar los routers





module.exports = router;
