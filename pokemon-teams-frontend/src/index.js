const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

getTrainersAndPokemon()


function getTrainersAndPokemon(){
    fetch('http://localhost:3000/trainers')
    .then((resp) => resp.json())
    .then((trainersAndPokemon) => {
        console.log(trainersAndPokemon)
        appendTrainersAndPokemonToPage(trainersAndPokemon)
    })
}

function appendTrainersAndPokemonToPage(trainersAndPokemon){
    const trainerMainCollect = document.querySelector('main');
    // console.log(trainerMainCollect)
     // <div class="card" data-id="1">
    trainersAndPokemon.forEach((tCard) => {
        console.log(tCard)
        const cardDiv = document.createElement('div')
        cardDiv.class = 'card'
        // cardDiv.setAttribute('data-id', '1')
        
        cardDiv.innerHTML = renderTrainerCard(tCard);
        trainerMainCollect.appendChild(cardDiv);
    });

}

function renderTrainerCard(trainer){
return `<div class="card" data-id="${trainer.id}">
<p>${trainer.name}</p>
  <button onclick=addPokemon(${trainer.id})>Add Pokemon</button>
  <ul>
  ${trainer.pokemons.map(renderPokemonCard).join('')}
  </ul>
  </div>
`
};

function renderPokemonCard(pokemon){
    return `<li id=pokemon-${pokemon.id}>${pokemon.nickname} (${pokemon.species}) <button class="release" onclick=releasePokemon(${pokemon.id})>Release</button></li>`
}

function addPokemon(trainerId) {
    // 1. Call backend to get new pokemon
    // 2. Replace/update trainer card with new pokemon on frontend
    const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({trainer_id: trainerId}),
      };
    
      fetch('http://localhost:3000/pokemons', options)
      .then((resp) => resp.json())
      .then((pokemon) => {
        // pessimistic render
        // console.log(pokemon)
        if (pokemon.error) return;
         addPokemonToTrainer(pokemon, trainerId)
        //appendTrainersAndPokemonToPage(pokemon);
      });
    console.log(trainerId)
}

function addPokemonToTrainer(pokemon, trainerId){
const trainerCard = Array.from(document.getElementsByClassName('card')).find((card) => {
   return card.dataset.id == trainerId
})
// console.log(trainerCard)
const pokemonList = trainerCard.children[2]
const newPokemon = document.createElement("li")
newPokemon.innerHTML = renderPokemonCard(pokemon)
pokemonList.appendChild(newPokemon)
}

function releasePokemon(pokemonId) {
    // 1. Call backend to release pokemon
    // 2. Remove pokemon <li> from team
    // console.log(pokemonId)
    const options = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      };
    
      fetch(`http://localhost:3000/pokemons/${pokemonId}`, options)
      .then((resp) => resp.json())
      .then((pokemon) => {
        // pessimistic render
        console.log(pokemon)
        removePokemonCard(pokemon)
         //addPokemonToTrainer(pokemon, trainerId)
        //appendTrainersAndPokemonToPage(pokemon);
      });

}

function removePokemonCard(pokemon){
const pokemonCard = document.getElementById(`pokemon-${pokemon.id}`)
// console.log(pokemon)
pokemonCard.remove()
}