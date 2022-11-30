/**
 * Class Pokemon
 */
export class TeamUser {
    owner_id: string
    pokemons_id: [string?, string?, string?, string?, string?, string?] = [];

    /**
     * Init the team
     */
    async initTeam(
            owner_id: string,
            pokemon_id: string,
        ): Promise<void> 
    {
        this.owner_id = owner_id;
        this.pokemons_id = [pokemon_id];
    }
}