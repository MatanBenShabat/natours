import axios from "axios";
import showAlert from "./alerts";

export const fetchLogout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: 'http://localhost:3000/api/v1/users/logout',
        });

        if (res.data.status === 'success') {
            location.reload();
        }
    } catch (err) {
        showAlert('error', 'Something went wrong while logging out, please try again in a few seconds.');
    }

}