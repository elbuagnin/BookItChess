// export type Color = 'w' | 'b'
// export type PieceSymbol = 'p' | 'N' | 'B' | 'R' | 'Q' | 'K'
// export type Square = `${string & { __brand: "/^[a,b,c,d,e,f,g,h][1,2,3,4,5,6,7,8]$/"}}`
// export type LAN = `${string & { __brand: "//^([a,b,c,d,e,f,g,h][1,2,3,4,5,6,7,8]){2}$/"}}`
// export type Flag = 'n' | 'b' | 'e' | 'p' | 'k' | 'q' | 'pc'
// export type FEN = `{string & { __brand: "/^(?:(?:[PNBRQK]+|[1-8])\/){7}(?:[PNBRQK]+|[1-8])$/gim"}}`

// export interface Move {
//     before: FEN,
//     after: FEN,
//     color: Color,
//     piece: PieceSymbol,
//     from: Square,
//     to: Square,
//     san: Square,
//     lan: LAN,
//     flags: Flag
// }

// export interface SquareState {
//     square: Square,
//     type: PieceSymbol,
//     color: Color
// }
import type * as Chess from "chess.js"
export type SquareState = ({ square: Square; type: PieceSymbol; color: Color; } | null)
export * from "chess.js"