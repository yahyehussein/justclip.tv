import { Emote } from "./types/emote";
import { Roles } from "./types/roles";

export const isAdminister = (role: Roles): role is Roles => {
    return (role as Roles).role === "admin";
};

export const isGlobalModerator = (role: Roles): role is Roles => {
    return (role as Roles).role === "global_mod";
};

export const secondsToHms = (d: number): string => {
    d = Number(d);
    const h = Math.floor(d / 3600);
    const m = Math.floor((d % 3600) / 60);
    const s = Math.floor((d % 3600) % 60);

    const hDisplay = h + "h";
    const mDisplay = m + "m";
    const sDisplay = s + "s";

    return hDisplay + mDisplay + sDisplay;
};

export const formatText = (
    textWithOutEmotes: string,
    emotes: Emote[]
): string => {
    let text = textWithOutEmotes
        .replace(
            /\b\w+\b/gi,
            '<span class="inline-block align-middle">$&</span>'
        )
        .replace(/(?:\r\n|\r|\n)/g, " <br> ")
        .replace(
            /\bhttps?:\/\/\S+/gi,
            '<a href="$&" target="_blank" rel="nofollow" class="text-primary hover:underline inline-block align-middle">$&</a>'
        );

    if (emotes) {
        emotes.map((emote) => {
            const regexEmote = RegExp(`(?<![\\w])${emote.code}(?![\\w])`, "gm");

            text = text.replace(
                regexEmote,
                `<img src="${emote.url}" alt="${emote.code}" class="emote" data-tippy-content="${emote.code}">`
            );
        });
    }

    return text;
};

export const isEnglish = (str: string): boolean => {
    const regex = new RegExp(/\w/);
    return regex.test(str);
};

export const isMobile = /mobile/i.test(window.navigator.userAgent);

export const number2Color = (number: number): string =>
    "#" + ("00000" + number.toString(16)).slice(-6);
