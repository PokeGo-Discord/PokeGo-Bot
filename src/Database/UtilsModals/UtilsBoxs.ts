import boxModal from "../Modals/boxModal";
import usersModal from "../Modals/usersModal";

export const getBoxsUser = async (userId: string) => {
    const userData = await usersModal.findOne({ userId })
    const boxsData = await boxModal.find({owner_id: userData.id})
    return boxsData;
}

export const getBoxNotFull = async (userId: string): Promise<any> =>
{
    const userData = await usersModal.findOne({ userId })
    const boxsData = await boxModal.find({owner_id: userData.id})
    let boxNotFull;
    boxsData.forEach(box => {
        if(box.pokemons_id.length < 4)
            boxNotFull = box;
    });

    return boxNotFull
}