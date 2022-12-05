import fetch from 'node-fetch';

export type BaseStatsType = {
    hp: number, 
    atk: number, 
    def: number, 
    satk: number, 
    sdef: number, 
    spd: number 
};

export async function getPokemonData(pokemonId: number) {
  try {
    const response = await fetch(`http://localhost/api/v2/pokemon/${pokemonId}/`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    const result = (await response.json());

    return result;
  } catch (error) {
    if (error instanceof Error) {
      console.log('error message: ', error.message);
      return error.message;
    } else {
      console.log('unexpected error: ', error);
      return 'An unexpected error occurred';
    }
  }
}

export async function getBaseStats(pokemonId: number): Promise<BaseStatsType | string> {
      const pokemonData: any = await getPokemonData(pokemonId)

      const baseStats: BaseStatsType = {
        hp: pokemonData.stats[0].base_stat,
        atk: pokemonData.stats[1].base_stat,
        def: pokemonData.stats[2].base_stat,
        satk: pokemonData.stats[3].base_stat,
        sdef: pokemonData.stats[4].base_stat,
        spd: pokemonData.stats[5].base_stat
      };
  
      return baseStats;
}

export async function getSpecieName(pokemonId: number): Promise<string> {
  const pokemonData: any = await getPokemonData(pokemonId)

  const specieName = pokemonData.species.name
  console.log(specieName)

  return specieName;
}

export async function getAllPokemonName(offset: number) {
  try {
    const url = `http://localhost/api/v2/pokemon-species/?limit=20&offset=${offset}`
    console.log(url)
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    const result: any = (await response.json());

    const pokemonName: string[] = []
    result.results.forEach(p => {
      pokemonName.push(p.name.charAt(0).toUpperCase() + p.name.slice(1))
    });

    return pokemonName;
  } catch (error) {
    if (error instanceof Error) {
      console.log('error message: ', error.message);
      return error.message;
    } else {
      console.log('unexpected error: ', error);
      return 'An unexpected error occurred';
    }
  }
}
