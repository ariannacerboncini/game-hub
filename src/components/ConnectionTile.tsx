import type { TileState } from "../types/connections";

type ConnectionTileProps = {
    tile: TileState;
    onClick: (word: string) => void;
}

export const ConnectionTile = ({ tile, onClick }: ConnectionTileProps) => {



    const handleClick = () => {
        if (tile.isLocked) return;
        onClick(tile.word);
    };

    return (
        <div
            className={""}
            onClick={handleClick}
        >
            {tile.word}
        </div>
    );
}