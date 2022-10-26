
import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore, limit, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import './leader-board.less';
import IMG_LOGO from "../../assets/images/logo.png";
import IMG_CITY from "../../assets/images/city.png";
import IMG_GAME from "../../assets/images/img-game.jpg"

const firebaseConfig = {
    authDomain: "monday-club-48189.firebaseapp.com",
    projectId: "monday-club-48189",
    storageBucket: "monday-club-48189.appspot.com",
    appId: "1:59628633346:web:2a0c2fa4d80ca1ed87961b",
    measurementId: "G-DM31RQF8RH"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const LeaderBoardComponent = () => {

    const [leaderScore, setLeaderScore] = useState([])

    useEffect(() => {
        readData();
    }, [])

    const readData = async () => {

        const scoreRef = collection(db, "score-2048");
        const q = query(scoreRef, orderBy("score", "desc"), limit(10));
        const leaderSc: any = [];
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            console.log(doc.data());
            leaderSc.push(doc.data().score);
        });

        setLeaderScore(leaderSc);
    }

    const backHome = () => {
        window.open('/', '_self');
    }
    return (
        <>
            <div className='lb-control'>
                <img src={IMG_LOGO} className="img-logo"></img>
                <h1 className='text-header-leader'>LEADERBOARD</h1>
                <div className='grid-control'>
                    {
                        leaderScore.map((element: any, index: number) => {

                            return (
                                <div className='grid-leader' key={index}>
                                    <span className='grid-item leader-board-text'>{index+1}</span>
                                    <span className='grid-item leader-board-text' >{element}</span>
                                </div>
                            )
                        })
                    }
                </div>
                <button className='button-home' onClick={backHome}>Home</button>
                <img src={IMG_CITY} className="img-city"></img>
            </div>
        </>
    );
}

export default LeaderBoardComponent;