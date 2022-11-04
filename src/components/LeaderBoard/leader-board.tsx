
import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore, limit, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import './leader-board.less';
import IMG_LOGO from "../../assets/images/logo.png";
import IMG_CITY from "../../assets/images/city.png";
import LeaderBoardModel from './leader-board-model';
import { useNavigate } from 'react-router-dom';
import UtilityService from '../utils/utility';

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
    let navigate = useNavigate();
    const [leaderScore, setLeaderScore] = useState<LeaderBoardModel[]>([])

    useEffect(() => {
        readData();
    }, [])

    const readData = async () => {

        const scoreRef = collection(db, "score-2048");
        const q = query(scoreRef, orderBy("score", "desc"), limit(10));
        const leaderSc: any = [];
        const querySnapshot = await getDocs(q);
        let leaderSC: LeaderBoardModel[] = [];
        querySnapshot.forEach((doc) => {
            leaderSc.push(doc.data());
            const objectSC: LeaderBoardModel = {
                isWinner: doc.data().isWinner,
                name: doc.data().name,
                score: doc.data().score,
                timeStamp: doc.data().timeStamp
            }
            leaderSC.push(objectSC)
        });
        setLeaderScore(leaderSC);
    }

    const backHome = () => {

        UtilityService().clickSendEvent('Click', 'Leaderboard', 'Back Home');
        navigate('/');
    }
    return (
        <>
            <div className='lb-control'>
                <img src={IMG_LOGO} className="img-logo"></img>
                <h1 className='text-header-leader'>LEADERBOARD</h1>
                <div className='grid-control'>
                    <div className='grid-leader' >
                        <span className='grid-item leader-board-text'>Rank</span>
                        <span className='grid-item leader-board-text' >Name</span>
                        <span className='grid-item leader-board-text' >Score</span>
                    </div>
                    {
                        leaderScore.map((element: LeaderBoardModel, index: number) => {

                            return (
                                <div className='grid-leader' key={index}>
                                    <span className='grid-item leader-board-text'>{index + 1}</span>
                                    <span className='grid-item leader-board-text' >{element.name}</span>
                                    <span className='grid-item leader-board-text' >{element.score.toLocaleString()}</span>
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