/*

	var board = {
		field: { // size 64
			null, // empty field
			{
				type: "Queen",
				color: "w"
			}
		}
		side: "w",
		castle: {
			white: {
				king: true,
				queen: true
			}
		},
		ep: "e3",
		halfmove: 0,
		fullmove: 0
	}
 */
class board
{
	constructor(fen)
	{
		this.board = [];
		let strings = fen.split(" ");

		let arr_place = strings[0].split("/")
		arr_place.reverse();
		let str_place = arr_place.toString();
		str_place = str_place.replace(',', '');

		var fen = {
			pieces: str_place,
			side: strings[1],
			castle: strings[2],
			ep: strings[3],
			halfmove: strings[4],
			fullmove: strings[5],
		}

		for (let i = 0; i < 63; i++) {
			if (fen.pieces.match(/^\d/)) {
				for (let j = 0; j < fen.pieces.at(0); j++) {
					this.board[i] = null;
					i++;
				}
			}
			else {
				this.board[i] = {
					type: "",
					color: fen.pieces.at(0).toUpperCase() == fen.pieces.at(0) ? "w" : "b",
				}
				fen.pieces.at(0) = fen.pieces.at(0).toLowerCase();
				switch (fen.pieces.at(0)) {
				case p:
					this.board[i].type = "Pawn";
					break;
				case n:
					this.board[i].type = "Knight";
					break;
				case b:
					this.board[i].type = "Bishop";
					break;
				case r:
					this.board[i].type = "Rook";
					break;
				case q:
					this.board[i].type = "Queen";
					break;
				case k:
					this.board[i].type = "King";
					break;
				}

			}

			fen.pieces = fen.pieces.substring(1);
		}

		this.side = fen.side;
		this.castle = {
			white: {
				king: false,
				queen: false,
			},
			black: {
				king: false,
				queen: false,
			}
		}
		if (fen.castle != '-') {
			while (fen.castle.length() > 0) {
				switch (fen.castle.at(0)) {
				case 'K:':
					this.castle.white.king = true;
					break;
				case 'k:':
					this.castle.black.king = true;
					break;
				case 'Q:':
					this.castle.white.queen = true;
					break;
				case 'q:':
					this.castle.black.queen = true;
					break;
				}

				fen.castle = fen.castle.substring(1);
			}
		}
		this.ep = fen.ep;
		this.halfmove = fen.halfmove;
		this.fullmove = fen.fullmove;

		return board;
	}

	is_check(from, to) {
		let king_pos = -1
		for (let i = 0; i < 64; i++) {
			if (this.board.at(i) != null &&
				this.board.at(i).type == "King" &&
				this.board.at(i).color == this.side) {
				king_pos = i;
				break;
			}
		}

		for (let i in this.side == "w" ? [7,9] : [-7,-9]) {
			let j = king_pos + i
			if (j < 64 && j >= 0 && i > 0 ? j % 8 != 0 : (j + 1) % 8 != 0) {
				continue;
			}
			if (this.board.at(j) != null &&
				this.board.at(j).type == "Pawn" &&
				this.board.at(j).color != this.side) {
				return false;
			}
		}

		for (let i in [[6,1], [10, 1], [15, 1], [17, 1], [6,-1], [10, -1], [15, -1], [17, -1]]) {
			let j = king_pos + i[0]*i[1]
			if (j < 64 && j >= 0 && i[1] > 0 ? j % 8 != 0 : (j + 1) % 8 != 0) {
				continue;
			}
			if (this.board.at(j) != null &&
				this.board.at(j).type == "Knight" &&
				this.board.at(j).color != this.side) {
				return false;
			}
		}

		for (let i in [[1,1], [1,0], [1,-1], [0,1], [0,0], [0,-1], [-1,1], [-1,0], [-1,-1]]) {
			for (let j = to; j < 64 && j >= 0 && i[1] > 0 ? j % 8 != 0 : (j + 1) % 8 != 0; j += 8*i[1] + i[0]) {
				if (this.board.at(j) != null) {
					if (this.board.at(j).color != this.side &&
						(this.board.at(j).type == "Rook" ||
						this.board.at(j).type == "Bishop" || // TODO: fix
						this.board.at(j).type == "Queen")) {
						return false;
					}
					break;
				}
			}
		}
	}

	move(san) {
		var from = -1;
		var to;
		var piece; // for promotions
		var capture = false;

		if (san.startsWith("O")) {
			if (color == "w" && san.length(3)) {
				if (!this.castle.white.king)
					return false;
				from = 4;
				to = 6;
			} else if (color == "w" && san.length(5)) {
				if (!this.castle.white.queen)
					return false;
				from = 4;
				to = 2;
			} else if (color == "b" && san.length(3)) {
				if (!this.castle.black.king)
					return false;
				from = 60;
				to = 62;
			} else if (color == "b" && san.length(5)) {
				if (!this.castle.black.queen)
					return false;
				from = 60;
				to = 58;
			}
		} else {
			if (san.at(0).toUpperCase() == san.at(0)) {
				piece = san.at(0);
				move = san.substring(1);
			} else if (san.includes('=')) {
				piece = san.at(-1);
				move = san.split('=')[0];
			} else {
				piece = 'P';
			}

			if (san.includes('x')) {
				capture = true;
			}

			to = san.at(-2).charCodeAt(0)-97 + (san.at(-1)-1)*8;

			if (this.board.at(to) == null &&
				capture == true &&
				this.ep.at(-2).charCodeAt(0)-97 + (this.ep.at(-1)-1)*8 != san.at(-2).charCodeAt(0)-97 + (san.at(-1)-1)*8 &&
				piece != 'P') {
				return false;
			}

			switch (piece){
			case 'P':
				if (capture && san.at(0) == x) {
					from = this.side == "w" ?
						san.at(1) == 'a' ? to - 7 :
						san.at(1) == 'h' ? to - 9 :
						this.board.at(to - 7) != null &&
							this.board.at(to - 7).type == "Pawn" &&
							this.board.at(to - 7).color == "w" ? to - 7 : to - 9 :
						san.at(1) == 'a' ? to + 9 :
						san.at(1) == 'h' ? to + 7 :
						this.board.at(to + 7) != null &&
							this.board.at(to + 7).type == "Pawn" &&
							this.board.at(to + 7).color == "b" ? to + 7 : to + 7;
				} else if (capture) {
					from = this.side = "w" ?
						to - (8 + (san.at(2).charCodeAt(0) - san.at(0).charCodeAt(0))) :
						to + (8 + (san.at(0).charCodeAt(0) - san.at(2).charCodeAt(0)));
				} else {
					from = this.side == "w" ?
						this.board.at(to - 8) != null ? to - 8 : to - 16 :
						this.board.at(to + 8) != null ? to + 8 : to + 16;
				}
				break;
			case 'R':
				if ((capture && san.length(4)) ||
					san.length(3)) {
					from = san.at(0).match(/^\d/) ? 
						to + (san.at(-1) - san.at(0)) * 8 :
						to + (san.at(-2).charCodeAt() - san.at(0).charCodeAt());
				} else {
					find: {
						for (let i = to; i % 8 != 0; i++) {
							if (this.board.at(i) != null) {
								if (this.board.at(i).type == "Rook" && this.board.at(i).color == this.side && is_check(board, i, to)) {
									from = i;
									break find;
								}
								break;
							}
						}
						for (let i = to; i % 8 != 0; i--) {
							if (this.board.at(i) != null) {
								if (this.board.at(i).type == "Rook" && this.board.at(i).color == this.side && is_check(board, i, to)) {
									from = i;
									break find;
								}
								break;
							}
						}
						for (let i = to; i < 64; i+=8) {
							if (this.board.at(i) != null) {
								if (this.board.at(i).type == "Rook" && this.board.at(i).color == this.side && is_check(board, i, to)) {
									from = i;
									break find;
								}
								break;
							}
						}
						for (let i = to; i >= 0; i-=8) {
							if (this.board.at(i) != null) {
								if (this.board.at(i).type == "Rook" && this.board.at(i).color == this.side && is_check(board, i, to)) {
									from = i;
									break find;
								}
								break;
							}
						}

					}
				}
				break;
			case 'B':
				[[1,1], [1,-1], [-1,1], [-1,-1]].forEach(i => {
					if (from == -1) {
						return;
					}
					for (let j = to; j < 64 && j >= 0 && i[1] > 0 ? j % 8 != 0 : (j + 1) % 8 != 0; j += (8 + i[0])*i[1]) {
						if (this.board.at(j) != null) {
							if (this.board.at(j).type == "Bishop" &&
								this.board.at(j).color == this.side &&
								((!capture && san.length() > 2) || san.length() > 3) ? 
									san.at(0).match(/^\d/) ?
										(san.at(0) - 1) * 8 == Math.floor(j/8) * 8 :
										san.at(1).match(/^\d/) ?
											j == san.at(0).charCodeAt(0)-97 + (san.at(1)-1)*8 :
											j % 8 == san.at(0).charCodeAt(0)-97 :
									true &&
									is_check(board, j, to)) {
								from = j;
								return
							}
							break;
						}
					}
				});
				break;
			case 'N':
				[[6,1], [10, 1], [15, 1], [17, 1], [6,-1], [10, -1], [15, -1], [17, -1]].forEach(i => {
					if (from == -1) {
						return;
					}
					let j = to + i[0]*i[1];
					if (j < 64 && j >= 0 && i[1] > 0 ? j % 8 != 0 : (j + 1) % 8 != 0) {
						return;
					}
					if (this.board.at(j) != null) {
						if (this.board.at(j).type == "Knight" &&
							this.board.at(j).color == this.side &&
							((!capture && san.length() > 2) || san.length() > 3) ? 
								san.at(0).match(/^\d/) ?
									(san.at(0) - 1) * 8 == Math.floor(j/8) * 8 :
									san.at(1).match(/^\d/) ?
										j == san.at(0).charCodeAt(0)-97 + (san.at(1)-1)*8 :
										j % 8 == san.at(0).charCodeAt(0)-97 :
								true &&
								is_check(board, j, to)) {
							from = j;
							return;
						}
					}
				});
				break;
			case 'Q':
				[[1,1], [1,0], [1,-1], [0,1], [0,0], [0,-1], [-1,1], [-1,0], [-1,-1]].forEach(i => { // TODO: this is just copy-paste bishop, need verify
					if (from == -1) {
						return;
					}
					for (let j = to; j < 64 && j >= 0 && i[1] > 0 ? j % 8 != 0 : (j + 1) % 8 != 0; j += 8*i[1] + i[0]) {
						if (this.board.at(j) != null) {
							if (this.board.at(j).type == "Queen" &&
								this.board.at(j).color == this.side &&
								((!capture && san.length() > 2) || san.length() > 3) ? 
									san.at(0).match(/^\d/) ?
										(san.at(0) - 1) * 8 == Math.floor(j/8) * 8 :
										san.at(1).match(/^\d/) ?
											j == san.at(0).charCodeAt(0)-97 + (san.at(1)-1)*8 :
											j % 8 == san.at(0).charCodeAt(0)-97 :
									true &&
									is_check(board, j, to)) {
								from = j;
								return;
							}
							break;
						}
					}
				});
				break;
			case 'K':
				[[1,1], [1,0], [1,-1], [0,1], [0,0], [0,-1], [-1,1], [-1,0], [-1,-1]].forEach(i => { // TODO: this is just copy-paste queen, need verify
					if (from == -1) {
						return;
					}
					let j = to + 8*i[1] + i[0];
					if (this.board.at(j) != null) {
						if (this.board.at(j).type == "King" &&
							this.board.at(j).color == this.side &&
							is_check(board, j, to)) {
							from = j;
							return;
						}
						return;
					}
				});
				break;
			}
		}
	}

	get_fen()
	{
		var fen_string = "";

		var empty = 0
		for (let i = 0; i < 63; i++) {
			index = 56 - Math.floor(i/8)*8 + i%8;
			if (i%8 == 0 && i != 0)
				if (empty != 0) {
					fen_string += empty;
					empty = 0;
				}
				fen_string += "/";
			if (this.board.at(index) == null) {
				empty++;
				continue;
			}
			if (empty != 0) {
				fen_string += empty;
				empty = 0;				
			}
			let char;
			switch (this.board.at(index).type) {
			case "Pawn":
				char = "p";
				break;
			case "Rook":
				char = "r";
				break;
			case "Knight":
				char = "n";
				break;
			case "Bishop":
				char = "b";
				break;
			case "King":
				char = "k";
				break;
			case "Queen":
				char = "q";
				break;
			}
			if (this.board.at(index).color == "b") {
				char.toUpperCase();
			}
			fen_string += char;
		}

		fen_string += (" " + this.side);

		var castle_string = "";
		if (this.castle.black.king)
			castle_string += "K";
		if (this.castle.black.queen)
			castle_string += "Q";
		if (this.castle.white.king)
			castle_string += "k";
		if (this.castle.white.queen)
			castle_string += "q";
		if (castle_string == "")
			castle_string == "-";
		fen_string += (" " + castle_string);

		fen_string += (" " + this.ep);
		fen_string += (" " + this.halfmove);
		fen_string += (" " + this.fullmove);
	}
}