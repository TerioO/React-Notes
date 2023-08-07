import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { setNotificationDays } from "../slices/db-slice";
import dayjs from "dayjs";
import React from "react";

type Props = {};

type RenderArray = {
    category: string;
    count: number;
    id: number;
}

export default function Dashboard({}: Props) {
    const db = useAppSelector((state) => state.db);
    const dispatch = useAppDispatch();

    const [days, setDays] = useState<number>(db.settings.daysToNotify);

    function handleSubmit(e: React.MouseEvent<HTMLFormElement>){
        e.preventDefault();
        dispatch(setNotificationDays(days));
    }

    const [renderArr, setRenderArr] = useState<{total: number, toRender: RenderArray[]}>({total: 0, toRender: []});
    useEffect(() => {
        checkDaysDiff();
    }, [db.notes])

    useEffect(() => {
        checkDaysDiff();
    }, [db.settings.daysToNotify])

    function checkDaysDiff(){
        let count = 0;
        let nr = 0;
        let temp: RenderArray[] = [];
        db.notes.forEach((el) => {
            const difference = dayjs(JSON.parse(el.date)).diff(dayjs(), 'd');
            if(difference <= db.settings.daysToNotify && difference >= 0){
                count += 1;
                nr += 1;
                let found = false;
                for(let i=0; i<temp.length; i++){
                    if(temp[i].category == el.category){
                        temp[i].count += 1;
                        found = true;
                        break;
                    }
                }
                if(!found) {
                    temp.push({category: el.category, count: 1, id: nr});
                }
            }
        })
        setRenderArr({...renderArr, total: nr, toRender: temp});
    }

    return (
        <div className="dashboard-c">
            <div className="inner-c">
                <form className="notification-setting" onSubmit={handleSubmit}>
                    <p>
                        Upcoming events in:
                        <input
                            type="number"
                            min={2}
                            value={days}
                            onChange={e => setDays(~~e.target.value)}
                        />
                        days
                        <button>OK</button>
                    </p>
                </form>
                <div className="display-status">
                    <p>
                        You have <b>{renderArr.total}</b> events in the upcoming {db.settings.daysToNotify} days. Open
                        notes and sort them by date.
                    </p>
                    <input type="checkbox" id="details" />
                    <label htmlFor="details">
                        Details
                        <span className="material-symbols-outlined icon">
                            change_history
                        </span>
                    </label>
                    <ul className="details-wrapper">
                        <p>{renderArr.total} total events from:</p>
                        {renderArr.toRender.map((el) => (
                            <React.Fragment key={el.id}>
                                <li>{el.category} - {el.count}</li>
                            </React.Fragment>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
