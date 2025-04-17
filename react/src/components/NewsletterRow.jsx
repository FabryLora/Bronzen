import React from "react";
import Switch from "./Switch";

export default function NewsletterRow({ newsObject }) {
    return (
        <tr className="odd:bg-gray-200 text-black">
            <td className="h-[50px]">{newsObject?.name}</td>
            <td>{newsObject?.email}</td>
            <td>{newsObject?.company}</td>
            <td className="h-[50px] flex justify-center items-center">
                <Switch
                    id={newsObject?.id}
                    path={"/subscriber"}
                    initialEnabled={newsObject?.active == 1 ? true : false}
                />
            </td>
        </tr>
    );
}
