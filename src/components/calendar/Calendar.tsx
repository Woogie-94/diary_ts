import React, { useEffect, useState } from "react";
import { RootStateOrAny, useSelector } from "react-redux";
import styled from "styled-components";

import CalendarInfo from "../../service/calendar";
import Week from "../week/Week";
import DaleNote from "../dalenote/Dalenote";
import { DaleNoteState } from "../../action/todo";

const CalendarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100vh;
  background: #999;
`;

const CalendarContent = styled.div`
  width: 80%;
  height: 90%;
  background: rgb(252, 251, 248);
  border-radius: 5px;
`;

const WeekContainer = styled.div`
  display: flex;
  width: 100%;
  height: calc(100% / 7);
  border-bottom: 1px solid #999;
`;

const DayContainer = styled.div`
  flex: 1 1;
  padding: 80px 10px;
  border-right: 1px solid #999;
`;

const Calendar = () => {
  console.log("Calendar");
  const [changeMonthNumber, setChangeMonthNumber] = useState<number>(0);
  const calendarInfo = new CalendarInfo(changeMonthNumber);
  const { targetDate, calendarArr } = calendarInfo;
  const dayNameList: string[] = ["Sunday", "Monday", "Tuseday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const { daleNoteReducer, noteOpenKeyReducer } = useSelector((state: RootStateOrAny) => state);
  const daleNoteData = daleNoteReducer.filter((data: DaleNoteState) => data.id === noteOpenKeyReducer);

  const onNextMonth = (): void => setChangeMonthNumber(changeMonthNumber + 1);
  const onPrevMonth = (): void => setChangeMonthNumber(changeMonthNumber - 1);

  const [ddd, setDdd] = useState<{
    [key: string]: { [key: string]: string }[];
  }>({});

  const test: { [key: string]: { [key: string]: string } } = {
    0: { start: "2021602", end: "2021612" },
    1: { start: "2021610", end: "2021620" },
    2: { start: "2021604", end: "2021606" },
    3: { start: "2021504", end: "2021606" },
    4: { start: "2021404", end: "2021606" },
    5: { start: "2021704", end: "2021706" },
    6: { start: "2021713", end: "2021806" },
  };

  useEffect(() => {
    const dddWrap: { [key: string]: { [key: string]: string }[] } = {};

    calendarInfo.calendarArr.forEach((el) => {
      el.forEach((day) => {
        const date: string = day.format("YYYYMDD");

        dddWrap[date] = [];
      });
    });
    Object.keys(test).forEach((el) => {
      const start = Number(test[el].start);
      const end = Number(test[el].end);
      const v = end - start;
      console.log(v);
      for (let i = 0; i <= v; i++) {
        if (dddWrap[String(start + i)]) {
          dddWrap[String(start + i)].push({ ...test[el] });
        }
      }
    });

    setDdd(dddWrap);
  }, [changeMonthNumber]);

  useEffect(() => {
    console.log(ddd);
  }, [ddd]);

  return (
    <CalendarContainer>
      <button onClick={onPrevMonth}>prev</button>
      <CalendarContent>
        <WeekContainer>
          <DayContainer>{targetDate.format("YYYYMM")}</DayContainer>
          {dayNameList.map((name, idx) => (
            <DayContainer key={idx}>{name}</DayContainer>
          ))}
        </WeekContainer>
        {calendarArr.map((week, idx) => {
          return <Week key={idx} week={week} WeekContainer={WeekContainer} />;
        })}
      </CalendarContent>
      <button onClick={onNextMonth}>next</button>
      {noteOpenKeyReducer && <DaleNote daleNoteData={daleNoteData[0]} />}
    </CalendarContainer>
  );
};

export default Calendar;
