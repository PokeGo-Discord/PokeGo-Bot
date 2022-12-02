import teamsModal from "../Modals/teamsModal";
import usersModal from "../Modals/usersModal";

export const getTeamUser = async (userId: string) => {
    console.log(userId)
    const userData = await usersModal.findOne({ userId })
    const teamsData = await teamsModal.findOne({owner_id: userData._id})
    console.log(teamsData)
    return teamsData;   
}