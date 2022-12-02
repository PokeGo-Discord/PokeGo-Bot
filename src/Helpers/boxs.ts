export class Boxs {
    owner_id: string
    pokemons_id: string[][]

    /**
     * Init the box
     */
    async initBox(
            owner_id: string,
        ): Promise<void> 
    {
        this.owner_id = owner_id;
    }
}