import boxModal from "../Modals/boxModal";
import usersModal from "../Modals/usersModal";

export const getBoxsUser = async (userId: string) => {
    const userData = await usersModal.findOne({ userId })
    const boxsData = await boxModal.findOne({owner_id: userData._id})
    return boxsData;
}