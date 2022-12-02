export class Boxs {
    ownerId: string
    pokemonsId: string[][]

    /**
     * Init the box
     */
    async initBox(
            owner_id: string,
        ): Promise<void> 
    {
        this.ownerId = owner_id;
    }

    async loadBox(
        owner_id: string,
        pokemons_id: string[][]
    ): Promise<void>
    {
        this.ownerId = owner_id;
        this.pokemonsId = pokemons_id;
    }

    public addPokemon(pokemonId) {
        this.getPokemonsId().push(pokemonId)
    }

    public printPokemonsArray() {
        console.log(this.pokemonsId)
    }

    private async removePokemon(pokemonId) {
        
    }

    public getPokemonsId() {
        return this.pokemonsId;
    }
}