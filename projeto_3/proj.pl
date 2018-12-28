masd/*Pe�as*/

peaobranco(peao-branco).
peaopreto(peao-preto).
reibranco(rei-branco).
reipreto(rei-preto).
espacovazio(vazio).

branco(P):- peaobranco(P); reibranco(P).
preto(P):- peaopreto(P); reipreto(P).

rei(X):- reibranco(X).
rei(X):- reipreto(X).
peao(X):- peaobranco(X).
peao(X):- peaopreto(X).


/*Tabuleiro*/

tabuleiro([[peao-branco,peao-branco,peao-branco,peao-branco,peao-branco,peao-branco,peao-branco,peao-branco],
[vazio,vazio,vazio,rei-branco,vazio,vazio,vazio,vazio],
[vazio,vazio,vazio,vazio,vazio,vazio,vazio,vazio],
[vazio,vazio,vazio,vazio,vazio,vazio,vazio,vazio],
[vazio,vazio,vazio,vazio,vazio,vazio,vazio,vazio],
[vazio,vazio,vazio,peao-preto,vazio,vazio,vazio,vazio],
[vazio,vazio,vazio,vazio,rei-preto,vazio,vazio,vazio],
[peao-preto,peao-preto,peao-preto,peao-preto,peao-preto,peao-preto,peao-preto,peao-preto]]).


/*Mostra Tabuleiro*/
mostra(H):- \+list_empty(H, true), write('  '), mostraLetras(H, 1), nl, mostraLinhas(H, 1), write(' '), nl.

mostraLetras([H | T], N):- write('_'), write(N), write('_ '), N1 is N + 1, mostraLetras(T, N1). 
mostraLetras([], N).

mostraTracos([H | T]):- write('___|'), mostraTracos(T).
mostraTracos([]).

mostraTracosCima([H | T]):- write(' ___'), mostraTracosCima(T).
mostraTracosCima([]).

mostraLinhas([H | T], N):- write(' |'), mostraEspacos(H), nl, write(N), write('|'), mostraColunas(H), nl, write(' |'), mostraTracos(H), nl, N1 is N+1, mostraLinhas(T, N1).
mostraLinhas([], N).
 
mostraColunas([H | T]):- write(' '), escreve(H), write(' |'), mostraColunas(T).
mostraColunas([]).

mostraEspacos([H | T]):- write('   |'), mostraEspacos(T).
mostraEspacos([]).



escreve(H):- espacovazio(H), write(' ').
escreve(H):- peaopreto(H), write('o').
escreve(H):- peaobranco(H), write('x').
escreve(H):- reipreto(H), write('O').
escreve(H):- reibranco(H), write('X').

/*Move Jogador*/

list_empty([], true).
list_empty([_|_], false).


move(Board, EndBoard, Jogador, X, Y, Xfinal, Yfinal, Counter, PC, End, Pc1, Pc2):- (X =< 0; Y =< 0; Xfinal =< 0; Yfinal =< 0; X >= 9; Y >= 9; Xfinal >= 9; Yfinal >= 9), ((((Pc1 == 0, Jogador == 1);(Jogador == 2, Pc2 == 0)), write('Peca fora do tabuleiro'), nl, write('Tente Outro Movimento'), nl);((Jogador == 1, Pc1 \= 0); (Jogador == 2, Pc2 \= 0))), novoMovimento(Board, Jogador, Counter, Pc1, Pc2, 0, 0, 0, 0, -1).
move(Board, EndBoard, Jogador, X, Y, Xfinal, Yfinal, Counter, PC, End, Pc1, Pc2):- write('move2'), nl,X > 0, Y > 0, Xfinal > 0, Yfinal > 0, X < 9, Y < 9, Xfinal < 9, Yfinal < 9, Y \= Yfinal, X \= Xfinal, ((((Pc1 == 0, Jogador == 1);(Jogador == 2, Pc2 == 0)), write('Nao pode mover na diagonal'), nl, write('Tente Outro Movimento'), nl);((Jogador == 1, Pc1 \= 0); (Jogador == 2, Pc2 \= 0))), novoMovimento(Board, Jogador, Counter, Pc1, Pc2, 0, 0, 0, 0, -1).
move(Board, EndBoard, Jogador, X, Y, Xfinal, Yfinal, Counter, PC, End, Pc1, Pc2):- write('move3'), nl,Y == Yfinal, X == Xfinal, write('Nao pode mover para o mesmo lugar'), nl, novoMovimento(Board, Jogador, Counter, Pc1, Pc2, 0, 0, 0, 0, -1).

move(Board, EndBoard, Jogador, X, Y, Xfinal, Yfinal, Counter, PC, End, Pc1, Pc2):- write('move4'), nl,X > 0, Y > 0, Xfinal > 0, Yfinal > 0, X < 9, Y < 9, Xfinal < 9, Yfinal < 9, X == Xfinal, Y \= Yfinal, retira(Board, NewBoard, X, Y, P, Jogador, Board, Counter, Pc1, Pc2), coloca(NewBoard, NewBoard2, Xfinal, Yfinal, P, Board, Jogador, Counter, Pc1, Pc2), eliminicaoCheck(NewBoard2, CheckBoard, Xfinal,Yfinal,P), list_empty(CheckBoard, R), ((R == true, EndBoard = NewBoard2) ; (R == false, EndBoard = CheckBoard)), getReiLinhas(EndBoard, 1, EndBoard, RP, RB), ((RP == 1, Jogador == 2, End is 1); (RB == 1, Jogador == 1, End is 1); (((RP == 1, Jogador == 1); (RB == 1, Jogador == 2)), ((((Pc1 == 0, Jogador == 1);(Jogador == 2, Pc2 == 0)), write('Nao pode fazer Checkmate ao seu Rei'), nl, write('Tente Outro Movimento'), nl);((Jogador == 1, Pc1 \= 0); (Jogador == 2, Pc2 \= 0))), novoMovimento(Board, Jogador, Counter, Pc1, Pc2, 0, 0, 0, 0, -1)); (RP == 0, RB == 0, End is 0)), mostra(EndBoard), nl.
move(Board, EndBoard, Jogador, X, Y, Xfinal, Yfinal, Counter, PC, End, Pc1, Pc2):- write('move5'), nl,X > 0, Y > 0, Xfinal > 0, Yfinal > 0, X < 9, Y < 9, Xfinal < 9, Yfinal < 9, Y == Yfinal, X \= Xfinal,write('8'), nl, retira(Board, NewBoard, X, Y, P, Jogador, Board, Counter, Pc1, Pc2), write('9'), nl, coloca(NewBoard, NewBoard2, Xfinal, Yfinal, P, Board, Jogador, Counter, Pc1, Pc2), write('10'), nl, eliminicaoCheck(NewBoard2, CheckBoard, Xfinal,Yfinal,P), list_empty(CheckBoard, R), ((R == true, EndBoard = NewBoard2) ; (R == false, EndBoard = CheckBoard)), getReiLinhas(EndBoard, 1, EndBoard, RP, RB), ((RP == 1, Jogador == 2, End is 1); (RB == 1, Jogador == 1, End is 1); (((RP == 1, Jogador == 1); (RB == 1, Jogador == 2)), ((((Pc1 == 0, Jogador == 1);(Jogador == 2, Pc2 == 0)), write('Nao pode fazer Checkmate ao seu Rei'), nl, write('Tente Outro Movimento'), nl);((Jogador == 1, Pc1 \= 0); (Jogador == 2, Pc2 \= 0))), novoMovimento(Board, Jogador, Counter, Pc1, Pc2, 0, 0, 0, 0, -1)); (RP == 0, RB == 0, End is 0)), mostra(EndBoard), nl.



/*Retira Pe�a*/

retira(Board, NewBoard, X, Y, P, Jogador, OldBoard, Counter, PC1, Pc2):- write('asd'), nl,  retiraLinha(Board, NewBoard, X , Y, 1, P, Jogador, OldBoard, Counter, PC1, Pc2), write('asd2'), nl.
retira(Board, NewBoard, X, Y):- retiraLinha(Board, NewBoard, X, Y, 1).

retiraLinha([H1 | T1], [H2 | T1], X, Y, N, P, Jogador, OldBoard, Counter, PC1, Pc2):- write('v'), nl, N == X, retiraColuna(H1, H2, Y, 1, P, Jogador, OldBoard, Counter, PC1, Pc2).
retiraLinha([H1 | T1], [H2 | T2], X, Y, N, P, Jogador, OldBoard, Counter, PC1, Pc2):-write('c'), nl,  N \= X, N1 is N + 1, H2 = H1, retiraLinha(T1, T2, X, Y, N1, P, Jogador, OldBoard, Counter, PC1, Pc2).
retiraLinha([H1 | T1], [H2 | T1], X, Y, N):-write('z'), nl,  N == X, retiraColuna(H1, H2, Y, 1).
retiraLinha([H1 | T1], [H2 | T2], X, Y, N):- write('x'), nl, N \= X, N1 is N + 1, H2 = H1, retiraLinha(T1, T2, X, Y, N1).


retiraColuna([H1 | T1], [H2 | T1], Y, N, P, Jogador, OldBoard, Counter, PC1, Pc2):- N == Y, H2 = 'vazio', P = H1, H1 \= 'vazio', comanda(Jogador, P).
retiraColuna([H1 | T1], [H2 | T2], Y, N, P, Jogador, OldBoard, Counter, PC1, Pc2):- N \= Y, H2 = H1, N1 is N + 1, retiraColuna(T1, T2, Y, N1, P, Jogador, OldBoard, Counter, PC1, Pc2).
retiraColuna([H1 | T1], [H2 | T1], Y, N, P, Jogador, OldBoard, Counter, PC1, Pc2):- N == Y, espacovazio(H1), ((((Pc1 == 0, Jogador == 1);(Jogador == 2, Pc2 == 0)), write('Nao ha nenhuma Peca nesta casa'), nl, write('Tente Outro Movimento'), nl);((Jogador == 1, Pc1 \= 0); (Jogador == 2, Pc2 \= 0))), novoMovimento(OldBoard, Jogador, Counter, PC1, Pc2, 0, 0, 0, 0, -1).
retiraColuna([H1 | T1], [H2 | T1], Y, N, P, Jogador, OldBoard, Counter, PC1, Pc2):- N == Y, \+ comanda(Jogador, H1), ((((Pc1 == 0, Jogador == 1);(Jogador == 2, Pc2 == 0)), write('Esta a mover uma Peca que nao e sua'), nl, write('Tente Outro Movimento'), nl);((Jogador == 1, Pc1 \= 0); (Jogador == 2, Pc2 \= 0))), novoMovimento(OldBoard, Jogador, Counter, PC1, Pc2, 0, 0, 0, 0, -1).
retiraColuna([H1 | T1], [H2 | T1], Y, N):- N == Y, H2 = 'vazio', nl.
retiraColuna([H1 | T1], [H2 | T2], Y, N):- N \= Y, H2 = H1, N1 is N + 1, retiraColuna(T1, T2, Y, N1).


/*Coloca Pe�a*/

coloca(Board, NewBoard, X, Y, P, OldBoard, Jogador, Counter, PC1, Pc2):- colocaLinha(Board, NewBoard, X , Y, 1, P, OldBoard, Jogador, Counter, PC1, Pc2).

colocaLinha([H1 | T1], [H2 | T1], X, Y, N, P, OldBoard, Jogador, Counter, PC1, Pc2):- N == X, colocaColuna(H1, H2, Y, 1, P, OldBoard, Jogador, Counter, PC1, Pc2).
colocaLinha([H1 | T1], [H2 | T2], X, Y, N, P, OldBoard, Jogador, Counter, PC1, Pc2):- N \= X, N1 is N + 1, H2 = H1, colocaLinha(T1, T2, X, Y, N1, P, OldBoard, Jogador, Counter, PC1, Pc2).

colocaColuna([H1 | T1], [H2 | T1], Y, N, P, OldBoard, Jogador, Counter, PC1, Pc2):- N == Y, H2 = P, H1 == 'vazio'.
colocaColuna([H1 | T1], [H2 | T2], Y, N, P, OldBoard, Jogador, Counter, PC1, Pc2):- N \= Y, H2 = H1, N1 is N + 1, colocaColuna(T1, T2, Y, N1, P, OldBoard, Jogador, Counter, PC1, Pc2).
colocaColuna([H1 | T1], [H2 | T1], Y, N, P, OldBoard, Jogador, Counter, PC1, Pc2):- N == Y, H1 \= 'vazio', ((((Pc1 == 0, Jogador == 1);(Jogador == 2, Pc2 == 0)),write('Casa esta ocupa por uma peca'), nl, write('Tente Outro Movimento'), nl);((Jogador == 1, Pc1 \= 0); (Jogador == 2, Pc2 \= 0))), novoMovimento(OldBoard, Jogador, Counter, PC1, Pc2, 0, 0, 0, 0, -1).


/*Get Elem*/

getElem(Board, X, Y, Elem):-(X =< 0; Y =< 0; X >= 9; Y >= 9), Elem = 'Fora'.
getElem(Board, X, Y, Elem):- (X > 0, Y > 0, X < 9, Y < 9), getElem(Board, X, Y, 1, Elem).
getElem([H | T], X, Y, N, Elem):- (X > 0, Y > 0, X < 9, Y < 9),X == N, nth1(Y, H, Elem).
getElem([H | T], X, Y, N, Elem):- (X > 0, Y > 0, X < 9, Y < 9),X \= N, N1 is N + 1, getElem(T, X, Y, N1, Elem).
getElem([],_,_,_,_). 


checkBoard(CheckBoard1, CheckBoard2, Result):- list_empty(CheckBoard2, R1), ((R1 == false, Result = CheckBoard2); (R1 == true, list_empty(CheckBoard1, R2), ((R2 == false, Result = CheckBoard1);(R2 == true, write(''))))).
checkBoard(CheckBoard1, CheckBoard2, CheckBoard3, Result):- list_empty(CheckBoard3, R1), ((R1 == false, CheckBoard = CheckBoard3);(R1 == true, list_empty(CheckBoard2, R2), ((R2 == false, Result = CheckBoard2); (R2 == true, list_empty(CheckBoard1, R3), ((R3 == false, Result = CheckBoard1);(R3 == true, write(''))))))).

/* Elimina�ao Check */

:-use_module(library(lists)).
eliminicaoCheck(Board, CheckBoard, Xfinal, Yfinal, P):- Xfinal > 2, Xfinal < 7, Yfinal > 2, Yfinal < 7, eliminicaoCheckHorizontal(Board, CheckBoardHorizontal, Xfinal, Yfinal, P), list_empty(CheckBoardHorizontal, R), (( R == false, eliminicaoCheckVertical(CheckBoardHorizontal, CheckBoardVertical, Xfinal, Yfinal, P));( R == true, eliminicaoCheckVertical(Board, CheckBoardVertical, Xfinal, Yfinal, P))), checkBoard(CheckBoardHorizontal, CheckBoardVertical, CheckBoard).
eliminicaoCheck(Board, CheckBoard, Xfinal, Yfinal, P):- ((Xfinal == 1, Yfinal == 1); (Xfinal == 2, Yfinal == 2)), eliminicaoCheckHorizontalDireita(Board, CheckBoardHorizontal, Xfinal, Yfinal, P), list_empty(CheckBoardHorizontal, R), (( R == false, eliminicaoCheckVerticalBaixo(CheckBoardHorizontal, CheckBoardVertical, Xfinal, Yfinal, P));( R == true, eliminicaoCheckVerticalBaixo(Board, CheckBoardVertical, Xfinal, Yfinal, P))), checkBoard(CheckBoardHorizontal, CheckBoardVertical, CheckBoard).
eliminicaoCheck(Board, CheckBoard, Xfinal, Yfinal, P):- ((Xfinal == 1, Yfinal == 8); (Xfinal == 2, Yfinal == 7)), eliminicaoCheckHorizontalEsquerda(Board, CheckBoardHorizontal, Xfinal, Yfinal, P), list_empty(CheckBoardHorizontal, R), (( R == false, eliminicaoCheckVerticalBaixo(CheckBoardHorizontal, CheckBoardVertical, Xfinal, Yfinal, P));( R == true, eliminicaoCheckVerticalBaixo(Board, CheckBoardVertical, Xfinal, Yfinal, P))), checkBoard(CheckBoardHorizontal, CheckBoardVertical, CheckBoard).
eliminicaoCheck(Board, CheckBoard, Xfinal, Yfinal, P):- ((Xfinal == 8, Yfinal == 1); (Xfinal == 7, Yfinal == 2)), eliminicaoCheckHorizontalDireita(Board, CheckBoardHorizontal, Xfinal, Yfinal, P), list_empty(CheckBoardHorizontal, R), (( R == false, eliminicaoCheckVerticalCima(CheckBoardHorizontal, CheckBoardVertical, Xfinal, Yfinal, P));( R == true, eliminicaoCheckVerticalCima(Board, CheckBoardVertical, Xfinal, Yfinal, P))), checkBoard(CheckBoardHorizontal, CheckBoardVertical, CheckBoard).
eliminicaoCheck(Board, CheckBoard, Xfinal, Yfinal, P):- ((Xfinal == 8, Yfinal == 8); (Xfinal == 7, Yfinal == 7)), eliminicaoCheckHorizontalEsquerda(Board, CheckBoardHorizontal, Xfinal, Yfinal, P), list_empty(CheckBoardHorizontal, R), (( R == false, eliminicaoCheckVerticalCima(CheckBoardHorizontal, CheckBoardVertical, Xfinal, Yfinal, P));( R == true, eliminicaoCheckVerticalCima(Board, CheckBoardVertical, Xfinal, Yfinal, P))), checkBoard(CheckBoardHorizontal, CheckBoardVertical, CheckBoard).
eliminicaoCheck(Board, CheckBoard, Xfinal, Yfinal, P):- ((Xfinal == 1, Yfinal > 2, Yfinal < 7); (Xfinal == 2, Yfinal > 2, Yfinal < 7)), eliminicaoCheckHorizontal(Board, CheckBoardHorizontal, Xfinal, Yfinal, P), list_empty(CheckBoardHorizontal, R), (( R == false, eliminicaoCheckVerticalBaixo(CheckBoardHorizontal, CheckBoardVertical, Xfinal, Yfinal, P));( R == true, eliminicaoCheckVerticalBaixo(Board, CheckBoardVertical, Xfinal, Yfinal, P))), checkBoard(CheckBoardHorizontal, CheckBoardVertical, CheckBoard).
eliminicaoCheck(Board, CheckBoard, Xfinal, Yfinal, P):- ((Xfinal == 8, Yfinal > 2, Yfinal < 7); (Xfinal == 7, Yfinal > 2, Yfinal < 7)), eliminicaoCheckHorizontal(Board, CheckBoardHorizontal, Xfinal, Yfinal, P), list_empty(CheckBoardHorizontal, R), (( R == false, eliminicaoCheckVerticalCima(CheckBoardHorizontal, CheckBoardVertical, Xfinal, Yfinal, P));( R == true, eliminicaoCheckVerticalCima(Board, CheckBoardVertical, Xfinal, Yfinal, P))), checkBoard(CheckBoardHorizontal, CheckBoardVertical, CheckBoard).
eliminicaoCheck(Board, CheckBoard, Xfinal, Yfinal, P):- ((Yfinal == 1, Xfinal > 2, Xfinal < 7); (Yfinal == 2, Xfinal > 2, Xfinal < 7)), eliminicaoCheckHorizontalDireita(Board, CheckBoardHorizontal, Xfinal, Yfinal, P), list_empty(CheckBoardHorizontal, R), (( R == false, eliminicaoCheckVertical(CheckBoardHorizontal, CheckBoardVertical, Xfinal, Yfinal, P));( R == true, eliminicaoCheckVertical(Board, CheckBoardVertical, Xfinal, Yfinal, P))), checkBoard(CheckBoardHorizontal, CheckBoardVertical, CheckBoard).
eliminicaoCheck(Board, CheckBoard, Xfinal, Yfinal, P):- ((Yfinal == 8, Xfinal > 2, Xfinal < 7); (Yfinal == 7, Xfinal > 2, Xfinal < 7)), eliminicaoCheckHorizontalEsquerda(Board, CheckBoardHorizontal, Xfinal, Yfinal, P), list_empty(CheckBoardHorizontal, R), (( R == false, eliminicaoCheckVertical(CheckBoardHorizontal, CheckBoardVertical, Xfinal, Yfinal, P));( R == true, eliminicaoCheckVertical(Board, CheckBoardVertical, Xfinal, Yfinal, P))), checkBoard(CheckBoardHorizontal, CheckBoardVertical, CheckBoard).

eliminicaoCheck(Board, CheckBoard, Xfinal, Yfinal, P):- Xfinal == 1, Yfinal == 2, eliminicaoCheckHorizontalDireita(Board, CheckBoardHorizontal, Xfinal, Yfinal, P), list_empty(CheckBoardHorizontal, R), (( R == false, eliminicaoCheckVerticalBaixo(CheckBoardHorizontal, CheckBoardVertical, Xfinal, Yfinal, P), list_empty(CheckBoardVertical, R2), (( R2 == false, eliminacaoCheckCorner(CheckBoardVertical, CheckBoardCorner, 1, 1));(R2 == true, eliminacaoCheckCorner(CheckBoardHorizontal, CheckBoardCorner, 1, 1))));(R == true, eliminicaoCheckVerticalBaixo(Board, CheckBoardVertical, Xfinal, Yfinal, P), list_empty(CheckBoardVertical, R2), ((R2 == false, eliminacaoCheckCorner(CheckBoardVertical, CheckBoardCorner, 1, 1));(R2 == true, eliminacaoCheckCorner(Board, CheckBoardCorner, 1, 1))))), checkBoard(CheckBoardCorner, CheckBoardHorizontal, CheckBoardVertical, CheckBoard).
eliminicaoCheck(Board, CheckBoard, Xfinal, Yfinal, P):- Xfinal == 2, Yfinal == 1, eliminicaoCheckHorizontalDireita(Board, CheckBoardHorizontal, Xfinal, Yfinal, P), list_empty(CheckBoardHorizontal, R), (( R == false, eliminicaoCheckVerticalBaixo(CheckBoardHorizontal, CheckBoardVertical, Xfinal, Yfinal, P), list_empty(CheckBoardVertical, R2), (( R2 == false, eliminacaoCheckCorner(CheckBoardVertical, CheckBoardCorner, 1, 1));(R2 == true, eliminacaoCheckCorner(CheckBoardHorizontal, CheckBoardCorner, 1, 1))));(R == true, eliminicaoCheckVerticalBaixo(Board, CheckBoardVertical, Xfinal, Yfinal, P), list_empty(CheckBoardVertical, R2), ((R2 == false, eliminacaoCheckCorner(CheckBoardVertical, CheckBoardCorner, 1, 1));(R2 == true, eliminacaoCheckCorner(Board, CheckBoardCorner, 1, 1))))), checkBoard(CheckBoardCorner, CheckBoardHorizontal, CheckBoardVertical, CheckBoard).

eliminicaoCheck(Board, CheckBoard, Xfinal, Yfinal, P):- Xfinal == 1, Yfinal == 7, eliminicaoCheckHorizontalEsquerda(Board, CheckBoardHorizontal, Xfinal, Yfinal, P), list_empty(CheckBoardHorizontal, R), (( R == false, eliminicaoCheckVerticalBaixo(CheckBoardHorizontal, CheckBoardVertical, Xfinal, Yfinal, P), list_empty(CheckBoardVertical, R2), (( R2 == false, eliminacaoCheckCorner(CheckBoardVertical, CheckBoardCorner, 1, 8));(R2 == true, eliminacaoCheckCorner(CheckBoardHorizontal, CheckBoardCorner, 1, 8))));(R == true, eliminicaoCheckVerticalBaixo(Board, CheckBoardVertical, Xfinal, Yfinal, P), list_empty(CheckBoardVertical, R2), ((R2 == false, eliminacaoCheckCorner(CheckBoardVertical, CheckBoardCorner, 1, 8));(R2 == true, eliminacaoCheckCorner(Board, CheckBoardCorner, 1, 8))))), checkBoard(CheckBoardCorner, CheckBoardHorizontal, CheckBoardVertical, CheckBoard).
eliminicaoCheck(Board, CheckBoard, Xfinal, Yfinal, P):- Xfinal == 2, Yfinal == 8, eliminicaoCheckHorizontalEsquerda(Board, CheckBoardHorizontal, Xfinal, Yfinal, P), list_empty(CheckBoardHorizontal, R), (( R == false, eliminicaoCheckVerticalBaixo(CheckBoardHorizontal, CheckBoardVertical, Xfinal, Yfinal, P), list_empty(CheckBoardVertical, R2), (( R2 == false, eliminacaoCheckCorner(CheckBoardVertical, CheckBoardCorner, 1, 8));(R2 == true, eliminacaoCheckCorner(CheckBoardHorizontal, CheckBoardCorner, 1, 8))));(R == true, eliminicaoCheckVerticalBaixo(Board, CheckBoardVertical, Xfinal, Yfinal, P), list_empty(CheckBoardVertical, R2), ((R2 == false, eliminacaoCheckCorner(CheckBoardVertical, CheckBoardCorner, 1, 8));(R2 == true, eliminacaoCheckCorner(Board, CheckBoardCorner, 1, 8))))), checkBoard(CheckBoardCorner, CheckBoardHorizontal, CheckBoardVertical, CheckBoard).

eliminicaoCheck(Board, CheckBoard, Xfinal, Yfinal, P):- Xfinal == 7, Yfinal == 1, eliminicaoCheckHorizontalDireita(Board, CheckBoardHorizontal, Xfinal, Yfinal, P), list_empty(CheckBoardHorizontal, R), (( R == false, eliminicaoCheckVerticalCima(CheckBoardHorizontal, CheckBoardVertical, Xfinal, Yfinal, P), list_empty(CheckBoardVertical, R2), (( R2 == false, eliminacaoCheckCorner(CheckBoardVertical, CheckBoardCorner, 8, 1));(R2 == true, eliminacaoCheckCorner(CheckBoardHorizontal, CheckBoardCorner, 8, 1))));(R == true, eliminicaoCheckVerticalCima(Board, CheckBoardVertical, Xfinal, Yfinal, P), list_empty(CheckBoardVertical, R2), ((R2 == false, eliminacaoCheckCorner(CheckBoardVertical, CheckBoardCorner, 8, 1));(R2 == true, eliminacaoCheckCorner(Board, CheckBoardCorner, 8, 1))))), checkBoard(CheckBoardCorner, CheckBoardHorizontal, CheckBoardVertical, CheckBoard).
eliminicaoCheck(Board, CheckBoard, Xfinal, Yfinal, P):- Xfinal == 8, Yfinal == 2, eliminicaoCheckHorizontalDireita(Board, CheckBoardHorizontal, Xfinal, Yfinal, P), list_empty(CheckBoardHorizontal, R), (( R == false, eliminicaoCheckVerticalCima(CheckBoardHorizontal, CheckBoardVertical, Xfinal, Yfinal, P), list_empty(CheckBoardVertical, R2), (( R2 == false, eliminacaoCheckCorner(CheckBoardVertical, CheckBoardCorner, 8, 1));(R2 == true, eliminacaoCheckCorner(CheckBoardHorizontal, CheckBoardCorner, 8, 1))));(R == true, eliminicaoCheckVerticalCima(Board, CheckBoardVertical, Xfinal, Yfinal, P), list_empty(CheckBoardVertical, R2), ((R2 == false, eliminacaoCheckCorner(CheckBoardVertical, CheckBoardCorner, 8, 1));(R2 == true, eliminacaoCheckCorner(Board, CheckBoardCorner, 8, 1))))), checkBoard(CheckBoardCorner, CheckBoardHorizontal, CheckBoardVertical, CheckBoard).

eliminicaoCheck(Board, CheckBoard, Xfinal, Yfinal, P):- Xfinal == 7, Yfinal == 8, eliminicaoCheckHorizontalEsquerda(Board, CheckBoardHorizontal, Xfinal, Yfinal, P), list_empty(CheckBoardHorizontal, R), (( R == false, eliminicaoCheckVerticalCima(CheckBoardHorizontal, CheckBoardVertical, Xfinal, Yfinal, P), list_empty(CheckBoardVertical, R2), (( R2 == false, eliminacaoCheckCorner(CheckBoardVertical, CheckBoardCorner, 8, 8));(R2 == true, eliminacaoCheckCorner(CheckBoardHorizontal, CheckBoardCorner, 8, 8))));(R == true, eliminicaoCheckVerticalCima(Board, CheckBoardVertical, Xfinal, Yfinal, P), list_empty(CheckBoardVertical, R2), ((R2 == false, eliminacaoCheckCorner(CheckBoardVertical, CheckBoardCorner, 8, 8));(R2 == true, eliminacaoCheckCorner(Board, CheckBoardCorner, 8, 8))))), checkBoard(CheckBoardCorner, CheckBoardHorizontal, CheckBoardVertical, CheckBoard).
eliminicaoCheck(Board, CheckBoard, Xfinal, Yfinal, P):- Xfinal == 8, Yfinal == 7, eliminicaoCheckHorizontalEsquerda(Board, CheckBoardHorizontal, Xfinal, Yfinal, P), list_empty(CheckBoardHorizontal, R), (( R == false, eliminicaoCheckVerticalCima(CheckBoardHorizontal, CheckBoardVertical, Xfinal, Yfinal, P), list_empty(CheckBoardVertical, R2), (( R2 == false, eliminacaoCheckCorner(CheckBoardVertical, CheckBoardCorner, 8, 8));(R2 == true, eliminacaoCheckCorner(CheckBoardHorizontal, CheckBoardCorner, 8, 8))));(R == true, eliminicaoCheckVerticalCima(Board, CheckBoardVertical, Xfinal, Yfinal, P), list_empty(CheckBoardVertical, R2), ((R2 == false, eliminacaoCheckCorner(CheckBoardVertical, CheckBoardCorner, 8, 8));(R2 == true, eliminacaoCheckCorner(Board, CheckBoardCorner, 8, 8))))), checkBoard(CheckBoardCorner, CheckBoardHorizontal, CheckBoardVertical, CheckBoard).


eliminicaoCheckHorizontal(Board, CheckBoard, Xfinal, Yfinal, P):- eliminicaoCheckHorizontalEsquerda(Board, CheckBoardHorizontalEsqerda, Xfinal, Yfinal, P), list_empty(CheckBoardHorizontalEsqerda, R), (( R == false, eliminicaoCheckHorizontalDireita(CheckBoardHorizontalEsqerda, CheckBoardHorizontalDireita, Xfinal, Yfinal, P));( R == true, eliminicaoCheckHorizontalDireita(Board, CheckBoardHorizontalDireita, Xfinal, Yfinal, P))), checkBoard(CheckBoardHorizontalEsqerda, CheckBoardHorizontalDireita, CheckBoard).

eliminicaoCheckHorizontalEsquerda(Board, CheckBoard, Xfinal, Yfinal, P):- PosCheck1 is Yfinal-1, getElem(Board, Xfinal, PosCheck1, Elem1), PosCheck2 is Yfinal-2, getElem(Board, Xfinal, PosCheck2, Elem2), Elem1 \= 'vazio',  Elem2 \= 'vazio', \+rei(Elem1),((branco(P), branco(Elem2), preto(Elem1)) ; (preto(P), preto(Elem2), branco(Elem1))), retira(Board, CheckBoard, Xfinal, PosCheck1).
eliminicaoCheckHorizontalEsquerda(Board, CheckBoard, Xfinal, Yfinal, P).

eliminicaoCheckHorizontalDireita(Board, CheckBoard, Xfinal, Yfinal, P):- PosCheck1 is Yfinal+1, getElem(Board, Xfinal, PosCheck1, Elem1), PosCheck2 is Yfinal+2, getElem(Board, Xfinal, PosCheck2, Elem2), Elem1 \= 'vazio',  Elem2 \= 'vazio', \+rei(Elem1),((branco(P), branco(Elem2), preto(Elem1)) ; (preto(P), preto(Elem2), branco(Elem1))), retira(Board, CheckBoard, Xfinal, PosCheck1).
eliminicaoCheckHorizontalDireita(Board, CheckBoard, Xfinal, Yfinal, P).

eliminicaoCheckVertical(Board, CheckBoard, Xfinal, Yfinal, P):- eliminicaoCheckVerticalCima(Board, CheckBoardVerticalCima, Xfinal, Yfinal, P), list_empty(CheckBoardVerticalCima, R), (( R == false, eliminicaoCheckVerticalBaixo(CheckBoardVerticalCima, CheckBoardVerticalBaixo, Xfinal, Yfinal, P));( R == true, eliminicaoCheckVerticalBaixo(Board, CheckBoardVerticalBaixo, Xfinal, Yfinal, P))), checkBoard(CheckBoardVerticalCima, CheckBoardVerticalBaixo,CheckBoard).


eliminicaoCheckVerticalCima(Board, CheckBoard, Xfinal, Yfinal, P):- PosCheck1 is Xfinal - 1, getElem(Board, PosCheck1, Yfinal, Elem1),  PosCheck2 is Xfinal - 2, getElem(Board, PosCheck2, Yfinal, Elem2), \+rei(Elem1),((branco(P), branco(Elem2), preto(Elem1)) ; (preto(P), preto(Elem2), branco(Elem1))), X1 is Xfinal - 1, retira(Board, CheckBoard, X1, Yfinal).
eliminicaoCheckVerticalCima(Board, CheckBoard, Xfinal, Yfinal, P).


eliminicaoCheckVerticalBaixo(Board, CheckBoard, Xfinal, Yfinal, P):- PosCheck1 is Xfinal + 1, getElem(Board, PosCheck1, Yfinal, Elem1),  PosCheck2 is Xfinal + 2, getElem(Board, PosCheck2, Yfinal, Elem2), \+rei(Elem1),((branco(P), branco(Elem2), preto(Elem1)) ; (preto(P), preto(Elem2), branco(Elem1))), X1 is Xfinal + 1, retira(Board, CheckBoard, X1, Yfinal).
eliminicaoCheckVerticalBaixo(Board, CheckBoard, Xfinal, Yfinal, P).


eliminacaoCheckCorner(Board, CheckBoard, 1, 1):- getElem(Board, 1, 1, Elem1), getElem(Board, 1, 2, Elem2), getElem(Board, 2, 1, Elem3), \+rei(Elem1), ((branco(Elem1), preto(Elem2), preto(Elem3));(preto(Elem1), branco(Elem2), branco(Elem3))), retira(Board, CheckBoard, 1, 1).
eliminacaoCheckCorner(Board, CheckBoard, 1, 1):-write('').

eliminacaoCheckCorner(Board, CheckBoard, 1, 8):- getElem(Board, 1, 8, Elem1), getElem(Board, 1, 7, Elem2), getElem(Board, 2, 8, Elem3), \+rei(Elem1), ((branco(Elem1), preto(Elem2), preto(Elem3));(preto(Elem1), branco(Elem2), branco(Elem3))), retira(Board, CheckBoard, 1, 8).
eliminacaoCheckCorner(Board, CheckBoard, 1, 8):-write('').

eliminacaoCheckCorner(Board, CheckBoard, 8, 1):- getElem(Board, 8, 1, Elem1), getElem(Board, 8, 2, Elem2), getElem(Board, 7, 1, Elem3), \+rei(Elem1), ((branco(Elem1), preto(Elem2), preto(Elem3));(preto(Elem1), branco(Elem2), branco(Elem3))), retira(Board, CheckBoard, 8, 1).
eliminacaoCheckCorner(Board, CheckBoard, 8, 1):-write('').

eliminacaoCheckCorner(Board, CheckBoard, 8, 8):- getElem(Board, 8, 8, Elem1), getElem(Board, 8, 7, Elem2), getElem(Board, 7, 8, Elem3), \+rei(Elem1), ((branco(Elem1), preto(Elem2), preto(Elem3));(preto(Elem1), branco(Elem2), branco(Elem3))), retira(Board, CheckBoard, 8, 8).
eliminacaoCheckCorner(Board, CheckBoard, 8, 8):-write('').





/*Check peoes*/

checkPeoes(Board, Xpos, Ypos, Jogador, Counter, Pc1, Pc2):- Jogador==1, getElem(Board, Xpos, Ypos, Elem), \+peaobranco(Elem), ((Ypos==8,Xpos<8, Ypos1 is 1, Xpos1 is Xpos + 1, checkPeoes(Board, Xpos1 , Ypos1, Jogador, Counter, Pc1, Pc2)) ; (Ypos<8,Ypos1 is Ypos+1, checkPeoes(Board, Xpos , Ypos1, Jogador, Counter, Pc1, Pc2))).
checkPeoes(Board, Xpos, Ypos, Jogador, Counter, Pc1, Pc2):- Jogador==1, getElem(Board, Xpos, Ypos, Elem), peaobranco(Elem), novoMovimento(Board, 2, Counter, Pc1, Pc2, 0, 0, 0, 0, -1), !.
checkPeoes(Board, Xpos, Ypos, Jogador, Counter, Pc1, Pc2):- Jogador==2, getElem(Board, Xpos, Ypos, Elem), \+peaopreto(Elem), ((Ypos==8,Xpos<8, Ypos1 is 1, Xpos1 is Xpos + 1, checkPeoes(Board, Xpos1 , Ypos1, Jogador, Counter, Pc1, Pc2)) ; (Ypos<8,Ypos1 is Ypos+1, checkPeoes(Board, Xpos , Ypos1, Jogador, Counter, Pc1, Pc2))).
checkPeoes(Board, Xpos, Ypos, Jogador, Counter, Pc1, Pc2):- Jogador==2, getElem(Board, Xpos, Ypos, Elem), peaopreto(Elem), novoMovimento(Board, 1, Counter, Pc1, Pc2, 0, 0, 0, 0, -1), !.
checkPeoes(Board, Xpos, Ypos, Jogador, Counter, Pc1, Pc2):- Xpos==8, Ypos==8, Jogador==1, endGame(1), !.
checkPeoes(Board, Xpos, Ypos, Jogador, Counter, Pc1, Pc2):- Xpos==8, Ypos==8, Jogador==2, endGame(2), !.

/*Check Rei*/

getReiLinhas([H | T], Xpos, Board, RP, RB):- getReiColunas(H, Xpos, 1, Board, RP, RB), Xpos1 is Xpos+1, getReiLinhas(T,Xpos1, Board, RP, RB).
getReiLinhas([], Xpos, Board, RP, RB).
getReiColunas([H | T], Xpos, Ypos, Board, RP, RB):- \+rei(H), Ypos1 is Ypos+1, getReiColunas(T, Xpos, Ypos1 , Board, RP, RB).
getReiColunas([H | T], Xpos, Ypos, Board, RP, RB):- rei(H), preto(H), checkRei(Board, Xpos,Ypos, H, R), Ypos1 is Ypos+1, ((R == 1, nl, RP is 1);(R == 0, RP is 0, getReiColunas(T, Xpos, Ypos1 , Board, RP, RB))).
getReiColunas([H | T], Xpos, Ypos, Board, RP, RB):- rei(H), branco(H), checkRei(Board, Xpos,Ypos, H, R), Ypos1 is Ypos+1, ((R == 1, nl, RB is 1);(R == 0, nl, RB is 0, getReiColunas(T, Xpos, Ypos1 , Board, RP, RB))).
getReiColunas([], Xpos, Ypos, Board, RP, RB).





checkRei(Board, XPos, YPos, Rei, R):- XPos > 1 , XPos < 8, YPos > 1, YPos < 8, XCima is XPos + 1, getElem(Board, XCima, YPos, ElemCima), XBaixo is XPos - 1, getElem(Board, XBaixo, YPos, ElemBaixo), YDireita is YPos + 1, getElem(Board, XPos, YDireita, ElemDireita), YEsquerda is YPos - 1, getElem(Board, XPos, YEsquerda, ElemEsquerda), \+espacovazio(ElemCima), \+espacovazio(ElemBaixo), \+espacovazio(ElemDireita), \+espacovazio(ElemEsquerda), ((preto(Rei), ((branco(ElemCima));(branco(ElemBaixo));(branco(ElemDireita));(branco(ElemEsquerda))));((branco(Rei), (preto((ElemCima));(preto(ElemBaixo));(preto(ElemDireita));(preto(ElemEsquerda)))))), R is 1.
checkRei(Board, XPos, YPos, Rei, R):- XPos > 1 , XPos < 8, YPos > 1, YPos < 8, R is 0.
checkRei(Board, XPos, YPos, Rei, R):- XPos == 1, YPos == 1, XBaixo is XPos - 1, getElem(Board, XBaixo, YPos, ElemBaixo), YDireita is YPos + 1, getElem(Board, XPos, YDireita, ElemDireita), \+espacovazio(ElemBaixo), \+espacovazio(ElemDireita), ((preto(Rei), ((branco(ElemBaixo));(branco(ElemDireita))));(branco(Rei), ((preto(ElemBaixo));(preto(ElemDireita))))), R is 1.
checkRei(Board, XPos, YPos, Rei, R):- XPos == 1, YPos == 1, R is 0.
checkRei(Board, XPos, YPos, Rei, R):- XPos == 8, YPos == 1, XCima is XPos + 1, getElem(Board, XCima, YPos, ElemCima), YDireita is YPos + 1, getElem(Board, XPos, YDireita, ElemDireita), \+espacovazio(ElemCima), \+espacovazio(ElemDireita), ((preto(Rei), ((branco(ElemCima));(branco(ElemDireita))));(branco(Rei), ((preto(ElemCima));(preto(ElemDireita))))), R is 1.
checkRei(Board, XPos, YPos, Rei, R):- XPos == 8, YPos == 1, R is 0.
checkRei(Board, XPos, YPos, Rei, R):- XPos == 1, YPos == 8, XBaixo is XPos - 1, getElem(Board, XBaixo, YPos, ElemBaixo), YEsquerda is YPos - 1, getElem(Board, XPos, YEsquerda, ElemEsquerda), \+espacovazio(ElemBaixo), \+espacovazio(ElemEsquerda), ((preto(Rei), ((branco(ElemBaixo));(branco(ElemEsquerda))));(branco(Rei), ((preto(ElemBaixo));(preto(ElemEsquerda))))), R is 1.
checkRei(Board, XPos, YPos, Rei, R):- XPos == 1, YPos == 8, R is 0.
checkRei(Board, XPos, YPos, Rei, R):- XPos == 8, YPos == 8, XCima is XPos + 1, getElem(Board, XBaixo, YPos, ElemCima), YEsquerda is YPos - 1, getElem(Board, XPos, YEsquerda, ElemEsquerda), \+espacovazio(ElemCima), \+espacovazio(ElemEsquerda), ((preto(Rei), ((branco(ElemCima));(branco(ElemEsquerda))));(branco(Rei), ((preto(ElemCima));(preto(ElemEsquerda))))), R is 1.
checkRei(Board, XPos, YPos, Rei, R):- XPos == 8, YPos == 8, R is 0.
checkRei(Board, XPos, YPos, Rei, R):- YPos == 1, XPos > 1, XPos < 8, XCima is XPos + 1, getElem(Board, XCima, YPos, ElemCima), XBaixo is XPos - 1, getElem(Board, XBaixo, YPos, ElemBaixo), YDireita is YPos + 1, getElem(Board, XPos, YDireita, ElemDireita), \+espacovazio(ElemCima), \+espacovazio(ElemBaixo), \+espacovazio(ElemDireita), ((preto(Rei), ((branco(ElemCima));(branco(ElemBaixo));(branco(ElemDireita))));(branco(Rei), ((preto(ElemCima));(preto(ElemBaixo));(preto(ElemDireita))))), R is 1.
checkRei(Board, XPos, YPos, Rei, R):- YPos == 1, XPos > 1, XPos < 8, R is 0.
checkRei(Board, XPos, YPos, Rei, R):- YPos == 8, XPos > 1, XPos < 8, XCima is XPos + 1, getElem(Board, XCima, YPos, ElemCima), XBaixo is XPos - 1, getElem(Board, XBaixo, YPos, ElemBaixo), YEsquerda is YPos - 1, getElem(Board, XPos, YEsquerda, ElemEsquerda), \+espacovazio(ElemCima), \+espacovazio(ElemBaixo), \+espacovazio(ElemEsquerda), ((preto(Rei), ((branco(ElemCima));(branco(ElemBaixo));(branco(ElemEsquerda))));(branco(Rei), ((preto(ElemCima));(preto(ElemBaixo));(preto(ElemEsquerda))))), R is 1.
checkRei(Board, XPos, YPos, Rei, R):- YPos == 8, XPos > 1, XPos < 8, R is 0.
checkRei(Board, XPos, YPos, Rei, R):- XPos == 1, YPos > 1, YPos < 8, XBaixo is XPos - 1, getElem(Board, XBaixo, YPos, ElemBaixo), YDireita is YPos + 1, getElem(Board, XPos, YDireita, ElemDireita), YEsquerda is YPos - 1, getElem(Board, XPos, YEsquerda, ElemEsquerda), \+espacovazio(ElemBaixo), \+espacovazio(ElemDireita), \+espacovazio(ElemEsquerda), ((preto(Rei), ((branco(ElemBaixo));(preto(ElemDireita));(branco(ElemEsquerda))));(branco(Rei), ((preto(ElemBaixo));(preto(ElemDireita));(preto(ElemEsquerda))))), R is 1.
checkRei(Board, XPos, YPos, Rei, R):- XPos == 1, YPos > 1, YPos < 8, R is 0.
checkRei(Board, XPos, YPos, Rei, R):- XPos == 8, YPos > 1, YPos < 8, XCima is XPos + 1, getElem(Board, XCima, YPos, ElemCima), YDireita is YPos + 1, getElem(Board, XPos, YDireita, ElemDireita), YEsquerda is YPos - 1, getElem(Board, XPos, YEsquerda, ElemEsquerda), \+espacovazio(ElemCima), \+espacovazio(ElemDireita), \+espacovazio(ElemEsquerda), ((preto(Rei), ((branco(ElemCima));(preto(ElemDireita));(branco(ElemEsquerda))));(branco(Rei), ((preto(ElemCima));(preto(ElemDireita));(preto(ElemEsquerda))))), R is 1.
checkRei(Board, XPos, YPos, Rei, R):- XPos == 8, YPos > 1, YPos < 8, R is 0.







/*Check Pecas Movimento*/

checkMovimentoHorizontal([H | T], XPeca, Xfinal, Y, Yfinal, PosX, R):-  Y == Yfinal, (R is 1).
checkMovimentoHorizontal([H | T], XPeca, Xfinal, Y, Yfinal, PosX, R):- PosX == XPeca, Y > Yfinal, Y1 is Y-1, checkMovimentoHorizontalLinha(H, Yfinal, Y1, R).
checkMovimentoHorizontal([H | T], XPeca, Xfinal, Y, Yfinal, PosX, R):- PosX == XPeca, Y < Yfinal, Y1 is Y+1, checkMovimentoHorizontalLinha(H, Y1, Yfinal, R).
checkMovimentoHorizontal([H | T], XPeca, Xfinal, Y, Yfinal, PosX, R):- PosX \= XPeca, X1 is PosX + 1, checkMovimentoHorizontal(T, XPeca,Xfinal, Y, Yfinal, X1, R).
checkMovimentoHorizontal([], XPeca, Y, Yfinal, PosX, R).

checkMovimentoHorizontalLinha(H, Y1, Y2, R):- Y1 < Y2, nth1(Y1, H, Elem), espacovazio(Elem), Ypos is Y1 + 1, checkMovimentoHorizontalLinha(H, Ypos, Y2, R).
checkMovimentoHorizontalLinha(H, Y1, Y2, R):- Y1 < Y2, nth1(Y1, H, Elem), \+espacovazio(Elem), R is 0.
checkMovimentoHorizontalLinha(H, Y1, Y2, R):- Y1 == Y2, nth1(Y1, H, Elem), \+espacovazio(Elem), R is 0.
checkMovimentoHorizontalLinha(H, Y1, Y2, R):- Y1 == Y2, nth1(Y1, H, Elem), espacovazio(Elem), R is 1.
checkMovimentoHorizontalLinha([], Y1, Y2, R).



checkMovimentoVertical(Board, XPeca, Xfinal, Y, Yfinal, PosX, R):- XPeca == Xfinal, (R is 1).
checkMovimentoVertical(Board, XPeca, Xfinal, Y, Yfinal, PosX, R):-(XPeca<Xfinal), checkMovimentoVerticalColuna(Board, XPeca, Xfinal, 1, Y, R).
checkMovimentoVertical(Board, XPeca, Xfinal, Y, Yfinal, PosX, R):-(XPeca>Xfinal), X1 is XPeca-1, X2 is Xfinal-1, checkMovimentoVerticalColuna(Board, X2, X1, 1, Y, R).
 
checkMovimentoVerticalColuna([H | T], X1, X2, Xpos, Y, R):- X1 >= Xpos, Xpos2 is Xpos + 1, checkMovimentoVerticalColuna(T, X1, X2, Xpos2, Y, R).
checkMovimentoVerticalColuna([H | T], X1, X2, Xpos, Y, R):- X1 < Xpos, X2\=Xpos, nth1(Y, H, Elem), espacovazio(Elem), Xpos2 is Xpos + 1, checkMovimentoVerticalColuna(T, X1, X2, Xpos2, Y, R).
checkMovimentoVerticalColuna([H | T], X1, X2, Xpos, Y, R):- X1 < Xpos, X2\=Xpos, nth1(Y, H, Elem), \+espacovazio(Elem),  (R is 0), !.
checkMovimentoVerticalColuna([H | T], X1, X2, Xpos, Y, R):- X2 == Xpos, nth1(Y, H, Elem), \+espacovazio(Elem), (R is 0), !.
checkMovimentoVerticalColuna([H | T], X1, X2, Xpos, Y, R):- X2 == Xpos, nth1(Y, H, Elem), espacovazio(Elem), (R is 1), !.
checkMovimentoVerticalColuna([], X1, X2, Xpos, Y, R).


/*Pc-Dificuldade = 1*/

:-use_module(library(random)).
randomPlay(Board, X, Y, Xfinal, Yfinal, Jogador):- randomPeca(Board, X, Y, Jogador), randomHorizontalVertical(Board, X, Y, Xfinal, Yfinal, Jogador).
randomPeca(Board, X, Y, Jogador):- random(1, 9, RandomX), random(1, 9, RandomY), checkCasa(Board, RandomX, RandomY, Jogador, R), ((R==0, randomPeca(Board, X, Y, Jogador)) ; (R==1, X is RandomX, Y is RandomY)).
checkCasa(Board, RandomX, RandomY, Jogador, R):- getElem(Board, RandomX, RandomY, Elem), Jogador==1, preto(Elem), checkCasaSurrounded(Board, RandomX, RandomY, Jogador, R).
checkCasa(Board, RandomX, RandomY, Jogador, R):- getElem(Board, RandomX, RandomY, Elem), Jogador==2, branco(Elem), checkCasaSurrounded(Board, RandomX, RandomY, Jogador, R).
checkCasa(Board, RandomX, RandomY, Jogador, R):- R is 0.

checkCasaSurrounded(Board, RandomX, RandomY, Jogador, R):- RandomYAbove is RandomY-1,RandomYBellow is RandomY+1, RandomXLeft is RandomX-1, RandomXRight is RandomX+1, (getElem(Board, RandomX, RandomYAbove, Elem1)), (getElem(Board, RandomX, RandomYBellow, Elem2)), (getElem(Board, RandomXLeft, RandomY, Elem3)), (getElem(Board, RandomXRight, RandomY, Elem4)), ((((espacovazio(Elem1);espacovazio(Elem2);espacovazio(Elem3);espacovazio(Elem4)),R is 1));(((\+espacovazio(Elem1),\+espacovazio(Elem2),\+espacovazio(Elem3),\+espacovazio(Elem4)), R is 0))).

randomHorizontalVertical(Board, X, Y, Xfinal, Yfinal, Jogador):- random(1, 3, HorVer), ((HorVer==1, randomHorizontal(Board, X, Y, Xfinal, Yfinal, Jogador)) ; (HorVer==2, randomVertical(Board, X, Y, Xfinal, Yfinal, Jogador))).
randomHorizontal(Board, X, Y, Xfinal, Yfinal, Jogador):- random(1, 8, RandomY), ((Y==RandomY, randomHorizontalVertical(Board, X, Y, Xfinal, Yfinal, Jogador)) ; (Y\=RandomY, checkMovimentoHorizontal(Board, X, X, Y, RandomY, 1, Legal), ((Legal==0, randomHorizontalVertical(Board, X, Y, Xfinal, Yfinal, Jogador)) ; (Legal==1, Yfinal is RandomY, Xfinal is X)))).
randomVertical(Board, X, Y, Xfinal, Yfinal, Jogador):- random(1, 8, RandomX), ((X==RandomX, randomHorizontalVertical(Board, X, Y, Xfinal, Yfinal, Jogador)) ; (X\=RandomX, checkMovimentoVertical(Board, X, RandomX, Y, Y, 1, Legal), ((Legal==0, randomHorizontalVertical(Board, X, Y, Xfinal, Yfinal, Jogador)) ; (Legal==1, Xfinal is RandomX, Yfinal is Y)))).

/*__________________________Pc-Dificuldade = 2__________________________*/

checkBestMove(Board, X, Y, Xfinal, Yfinal, Jogador):- checkCerco(Board, X1, Y1, Xfinal1, Yfinal1, Jogador, R1), R1==1, X is X1, Y is Y1, Xfinal is Xfinal1, Yfinal is Yfinal1, R is 1, !.
checkBestMove(Board, X, Y, Xfinal, Yfinal, Jogador):- checkCercoRei(Board, X1, Y1, Xfinal1, Yfinal1, 1, 1, Jogador, R1), R1==1, X is X1, Y is Y1, Xfinal is Xfinal1, Yfinal is Yfinal1, R is 1, !.
checkBestMove(Board, X, Y, Xfinal, Yfinal, Jogador):- randomPlay(Board, X, Y, Xfinal, Yfinal, Jogador), !.



/*CheckCercoRei*/

checkCercoRei(Board, X, Y, Xfinal, Yfinal, Xpos, Ypos, Jogador, R):- getElem(Board, Xpos, Ypos, Elem), Jogador == 1, \+reibranco(Elem), ((Ypos==8,Xpos<8, Ypos1 is 1, Xpos1 is Xpos + 1, checkCercoRei(Board, X, Y, Xfinal, Yfinal, Xpos1 , Ypos1, Jogador, R));(Ypos<8,Ypos1 is Ypos+1, checkCercoRei(Board, X, Y, Xfinal, Yfinal, Xpos , Ypos1, Jogador, R))).
checkCercoRei(Board, X, Y, Xfinal, Yfinal, Xpos, Ypos, Jogador, R):- getElem(Board, Xpos, Ypos, Elem), Jogador == 1, reibranco(Elem), XposAbove is Xpos-1, XposBellow is Xpos+1, YposLeft is Ypos-1, YposRight is Ypos+1, getElem(Board, XposAbove, Ypos, ElemAbove), getElem(Board, XposBellow, Ypos, ElemBellow),getElem(Board, Xpos, YposLeft, ElemLeft), getElem(Board, Xpos, YposRight, ElemRight)
																	,	((espacovazio(ElemAbove), hasPieceToMoveToPos(Board, XposAbove, Ypos, Xfinal1, Yfinal1, Jogador, R1), R1== 1, R is R1, Xfinal is XposAbove, Yfinal is Ypos, X is Xfinal1, Y is Yfinal1, !)
																	;	(espacovazio(ElemBellow), hasPieceToMoveToPos(Board, XposBellow, Ypos, Xfinal1, Yfinal1, Jogador, R1), R1== 1, R is R1, Xfinal is XposBellow, Yfinal is Ypos, X is Xfinal1, Y is Yfinal1, !)
																	;	(espacovazio(ElemLeft), hasPieceToMoveToPos(Board, Xpos, YposLeft, Xfinal1, Yfinal1, Jogador, R1), R1== 1, R is R1, Xfinal is Xpos, Yfinal is YposLeft, X is Xfinal1, Y is Yfinal1, !)
																	;	(espacovazio(ElemRight), hasPieceToMoveToPos(Board, Xpos, YposRight, Xfinal1, Yfinal1, Jogador, R1), R1== 1, R is R1, Xfinal is Xpos, Yfinal is YposRight, X is Xfinal1, Y is Yfinal1, !)
																	; 	(R is 0, !)).
checkCercoRei(Board, X, Y, Xfinal, Yfinal, Xpos, Ypos, Jogador, R):- getElem(Board, Xpos, Ypos, Elem), Jogador == 2, \+reipreto(Elem), ((Ypos==8,Xpos<8, Ypos1 is 1, Xpos1 is Xpos + 1, checkCercoRei(Board, X, Y, Xfinal, Yfinal, Xpos1 , Ypos1, Jogador, R));(Ypos<8,Ypos1 is Ypos+1, checkCercoRei(Board, X, Y, Xfinal, Yfinal, Xpos , Ypos1, Jogador, R))).
checkCercoRei(Board, X, Y, Xfinal, Yfinal, Xpos, Ypos, Jogador, R):- getElem(Board, Xpos, Ypos, Elem), Jogador == 2, reipreto(Elem), XposAbove is Xpos-1, XposBellow is Xpos+1, YposLeft is Ypos-1, YposRight is Ypos+1, getElem(Board, XposAbove, Ypos, ElemAbove), getElem(Board, XposBellow, Ypos, ElemBellow),getElem(Board, Xpos, YposLeft, ElemLeft), getElem(Board, Xpos, YposRight, ElemRight)
																	,	((espacovazio(ElemAbove), hasPieceToMoveToPos(Board, XposAbove, Ypos, Xfinal1, Yfinal1, Jogador, R1), R1== 1, R is R1, Xfinal is XposAbove, Yfinal is Ypos, X is Xfinal1, Y is Yfinal1, !)
																	;	(espacovazio(ElemBellow), hasPieceToMoveToPos(Board, XposBellow, Ypos, Xfinal1, Yfinal1, Jogador, R1), R1== 1, R is R1, Xfinal is XposBellow, Yfinal is Ypos, X is Xfinal1, Y is Yfinal1, !)
																	;	(espacovazio(ElemLeft), hasPieceToMoveToPos(Board, Xpos, YposLeft, Xfinal1, Yfinal1, Jogador, R1), R1== 1, R is R1, Xfinal is Xpos, Yfinal is YposLeft, X is Xfinal1, Y is Yfinal1, !)
																	;	(espacovazio(ElemRight), hasPieceToMoveToPos(Board, Xpos, YposRight, Xfinal1, Yfinal1, Jogador, R1), R1== 1, R is R1, Xfinal is Xpos, Yfinal is YposRight, X is Xfinal1, Y is Yfinal1, !)
																	; 	(R is 0, !)).										
checkCercoRei(Board, X, Y, Xfinal, Yfinal, Xpos, Ypos, Jogador, R):- Xpos == 8,Ypos==8, R is 0, !.



/*CheckCerco*/
checkCerco(Board, X, Y, Xfinal, Yfinal, Jogador, R):- checkCercoLinhaCheck(Board, X1, Y1, Xfinal1, Yfinal1, 1, 1, Jogador, R1),checkCercoColunaCheck(Board, X2, Y2, Xfinal2, Yfinal2, 1, 1, Jogador, R2), !, ((R1==1, X is X1, Y is Y1, Xfinal is Xfinal1, Yfinal is Yfinal1, R is 1) ; (R2==1, X is X2, Y is Y2, Xfinal is Xfinal2, Yfinal is Yfinal2, R is 1)), !.
checkCerco(Board, X, Y, Xfinal, Yfinal, Jogador, R):- R is 0, !.

checkCercoLinhaCheck(Board, X, Y, Xfinal, Yfinal, Xpos, Ypos, Jogador, R):- checkCercoLinha(Board, X1, Y1, Xfinal1, Yfinal1, Xpos, Ypos, Jogador, R1), ((R1==0,  ((Ypos==8,Xpos<8, Ypos1 is 1, Xpos1 is Xpos + 1, checkCercoLinhaCheck(Board, X, Y, Xfinal, Yfinal, Xpos1 , Ypos1, Jogador, R));(Ypos<8,Ypos1 is Ypos+1, checkCercoLinhaCheck(Board, X, Y, Xfinal, Yfinal, Xpos , Ypos1, Jogador, R)))) ; (R1 == 1, R is 1, X is Xfinal1, Y is Yfinal1, Xfinal is X1, Yfinal is Y1, !)).
checkCercoLinhaCheck(Board, X, Y, Xfinal, Yfinal, Xpos, Ypos, Jogador, R):- Xpos == 8,Ypos==8, R is 0, !.

checkCercoLinha(Board, X, Y, Xfinal, Yfinal, Xpos, Ypos, Jogador, R):- Jogador == 1, getElem(Board, Xpos, Ypos, Elem), branco(Elem), ((Xpos\=1, Ypos\=1), (Xpos\=1, Ypos\=8), (Xpos\=8, Ypos\=1), (Xpos\=8, Ypos\=8)), YposLeft is Ypos-1, YposRight is Ypos+1,getElem(Board, Xpos, YposLeft, ElemLeft), getElem(Board, Xpos, YposRight, ElemRight), (preto(ElemLeft), espacovazio(ElemRight), hasPieceToMoveToPos(Board, Xpos, YposRight, Xfinal1, Yfinal1, Jogador, R1), R1== 1, R is R1, X is Xpos, Y is YposRight, Xfinal is Xfinal1, Yfinal is Yfinal1, !).
checkCercoLinha(Board, X, Y, Xfinal, Yfinal, Xpos, Ypos, Jogador, R):- Jogador == 1, getElem(Board, Xpos, Ypos, Elem), branco(Elem), ((Xpos\=1, Ypos\=1), (Xpos\=1, Ypos\=8), (Xpos\=8, Ypos\=1), (Xpos\=8, Ypos\=8)), YposLeft is Ypos-1, YposRight is Ypos+1,getElem(Board, Xpos, YposLeft, ElemLeft), getElem(Board, Xpos, YposRight, ElemRight), (espacovazio(ElemLeft), preto(ElemRight), hasPieceToMoveToPos(Board, Xpos, YposLeft, Xfinal1, Yfinal1, Jogador, R1), R1== 1, R is R1, X is Xpos, Y is YposLeft, Xfinal is Xfinal1, Yfinal is Yfinal1, !).
checkCercoLinha(Board, X, Y, Xfinal, Yfinal, Xpos, Ypos, Jogador, R):- Jogador == 1, getElem(Board, Xpos, Ypos, Elem), branco(Elem), ((Xpos==1, Ypos==1); (Xpos==1, Ypos==8); (Xpos==8, Ypos==1); (Xpos==8, Ypos==8)), checkCorner(Board, X1, Y1, Xfinal1, Yfinal1, Xpos, Ypos, Jogador, R1), R1== 1, R is R1, X is X1, Y is Y1, Xfinal is Xfinal1, Yfinal is Yfinal1, !.
checkCercoLinha(Board, X, Y, Xfinal, Yfinal, Xpos, Ypos, Jogador, R):- Jogador == 2, getElem(Board, Xpos, Ypos, Elem), preto(Elem), ((Xpos\=1, Ypos\=1), (Xpos\=1, Ypos\=8), (Xpos\=8, Ypos\=1), (Xpos\=8, Ypos\=8)), YposLeft is Ypos-1, YposRight is Ypos+1,getElem(Board, Xpos, YposLeft, ElemLeft), getElem(Board, Xpos, YposRight, ElemRight), (branco(ElemLeft), espacovazio(ElemRight), hasPieceToMoveToPos(Board, Xpos, YposRight, Xfinal1, Yfinal1, Jogador, R1), R1== 1, R is R1, X is Xpos, Y is YposRight, Xfinal is Xfinal1, Yfinal is Yfinal1, !).
checkCercoLinha(Board, X, Y, Xfinal, Yfinal, Xpos, Ypos, Jogador, R):- Jogador == 2, getElem(Board, Xpos, Ypos, Elem), preto(Elem), ((Xpos\=1, Ypos\=1), (Xpos\=1, Ypos\=8), (Xpos\=8, Ypos\=1), (Xpos\=8, Ypos\=8)), YposLeft is Ypos-1, YposRight is Ypos+1,getElem(Board, Xpos, YposLeft, ElemLeft), getElem(Board, Xpos, YposRight, ElemRight), (espacovazio(ElemLeft), branco(ElemRight), hasPieceToMoveToPos(Board, Xpos, YposLeft, Xfinal1, Yfinal1, Jogador, R1), R1== 1, R is R1, X is Xpos, Y is YposLeft, Xfinal is Xfinal1, Yfinal is Yfinal1, !).
checkCercoLinha(Board, X, Y, Xfinal, Yfinal, Xpos, Ypos, Jogador, R):- Jogador == 2, getElem(Board, Xpos, Ypos, Elem), preto(Elem), ((Xpos==1, Ypos==1); (Xpos==1, Ypos==8); (Xpos==8, Ypos==1); (Xpos==8, Ypos==8)), checkCorner(Board, X1, Y1, Xfinal1, Yfinal1, Xpos, Ypos, Jogador, R1), R1== 1, R is R1, X is X1, Y is Y1, Xfinal is Xfinal1, Yfinal is Yfinal1, !.
checkCercoLinha(Board, X, Y, Xfinal, Yfinal, Xpos, Ypos, Jogador, R):- R is 0, !.

checkCercoColunaCheck(Board, X, Y, Xfinal, Yfinal, Xpos, Ypos, Jogador, R):-  checkCercoColuna(Board, X1, Y1, Xfinal1, Yfinal1, Xpos, Ypos, Jogador, R1), ((R1==0,  ((Ypos==8,Xpos<8, Ypos1 is 1, Xpos1 is Xpos + 1, checkCercoColunaCheck(Board, X, Y, Xfinal, Yfinal, Xpos1 , Ypos1, Jogador, R));(Ypos<8,Ypos1 is Ypos+1, checkCercoColunaCheck(Board, X, Y, Xfinal, Yfinal, Xpos , Ypos1, Jogador, R)))) ; ( R1 == 1, R is 1, X is Xfinal1, Y is Yfinal1, Xfinal is X1, Yfinal is Y1, !)).
checkCercoColuna(Board, X, Y, Xfinal, Yfinal, Xpos, Ypos, Jogador, R):- Jogador == 1, getElem(Board, Xpos, Ypos, Elem), branco(Elem), ((Xpos\=1, Ypos\=1), (Xpos\=1, Ypos\=8), (Xpos\=8, Ypos\=1), (Xpos\=8, Ypos\=8)), XposAbove is Xpos-1, XposBellow is Xpos+1,getElem(Board, XposAbove, Ypos, ElemAbove), getElem(Board, XposBellow, Ypos, ElemBellow), (preto(ElemAbove), espacovazio(ElemBellow), hasPieceToMoveToPos(Board, XposBellow, Ypos, Xfinal1, Yfinal1, Jogador, R1), R1== 1, R is R1, X is XposBellow, Y is Ypos, Xfinal is Xfinal1, Yfinal is Yfinal1, !).
checkCercoColuna(Board, X, Y, Xfinal, Yfinal, Xpos, Ypos, Jogador, R):- Jogador == 1, getElem(Board, Xpos, Ypos, Elem), branco(Elem), ((Xpos\=1, Ypos\=1), (Xpos\=1, Ypos\=8), (Xpos\=8, Ypos\=1), (Xpos\=8, Ypos\=8)), XposAbove is Xpos-1, XposBellow is Xpos+1,getElem(Board, XposAbove, Ypos, ElemAbove), getElem(Board, XposBellow, Ypos, ElemBellow), (espacovazio(ElemAbove), preto(ElemBellow), hasPieceToMoveToPos(Board, XposAbove, Ypos, Xfinal1, Yfinal1, Jogador, R1), R1== 1, R is R1, X is XposAbove, Y is Ypos, Xfinal is Xfinal1, Yfinal is Yfinal1, !).
checkCercoColuna(Board, X, Y, Xfinal, Yfinal, Xpos, Ypos, Jogador, R):- Jogador == 1, getElem(Board, Xpos, Ypos, Elem), branco(Elem), ((Xpos==1, Ypos==1); (Xpos==1, Ypos==8); (Xpos==8, Ypos==1); (Xpos==8, Ypos==8)), checkCorner(Board, X1, Y1, Xfinal1, Yfinal1, Xpos, Ypos, Jogador, R1), R1== 1, R is R1, X is X1, Y is Y1, Xfinal is Xfinal1, Yfinal is Yfinal1, !.
checkCercoColuna(Board, X, Y, Xfinal, Yfinal, Xpos, Ypos, Jogador, R):- Jogador == 2, getElem(Board, Xpos, Ypos, Elem), preto(Elem), ((Xpos\=1, Ypos\=1), (Xpos\=1, Ypos\=8), (Xpos\=8, Ypos\=1), (Xpos\=8, Ypos\=8)), XposAbove is Xpos-1, XposBellow is Xpos+1,getElem(Board, XposAbove, Ypos, ElemAbove), getElem(Board, XposBellow, Ypos, ElemBellow), (branco(ElemAbove), espacovazio(ElemBellow), hasPieceToMoveToPos(Board, XposBellow, Ypos, Xfinal1, Yfinal1, Jogador, R1), R1== 1, R is R1, X is XposBellow, Y is Ypos, Xfinal is Xfinal1, Yfinal is Yfinal1, !).
checkCercoColuna(Board, X, Y, Xfinal, Yfinal, Xpos, Ypos, Jogador, R):- Jogador == 2, getElem(Board, Xpos, Ypos, Elem), preto(Elem), ((Xpos\=1, Ypos\=1), (Xpos\=1, Ypos\=8), (Xpos\=8, Ypos\=1), (Xpos\=8, Ypos\=8)), XposAbove is Xpos-1, XposBellow is Xpos+1,getElem(Board, XposAbove, Ypos, ElemAbove), getElem(Board, XposBellow, Ypos, ElemBellow), (espacovazio(ElemAbove), branco(ElemBellow), hasPieceToMoveToPos(Board, XposAbove, Ypos, Xfinal1, Yfinal1, Jogador, R1), R1== 1, R is R1, X is XposAbove, Y is Ypos, Xfinal is Xfinal1, Yfinal is Yfinal1, !).
checkCercoColuna(Board, X, Y, Xfinal, Yfinal, Xpos, Ypos, Jogador, R):- Jogador == 2, getElem(Board, Xpos, Ypos, Elem), preto(Elem), ((Xpos==1, Ypos==1); (Xpos==1, Ypos==8); (Xpos==8, Ypos==1); (Xpos==8, Ypos==8)), checkCorner(Board, X1, Y1, Xfinal1, Yfinal1, Xpos, Ypos, Jogador, R1), R1== 1, R is R1, X is X1, Y is Y1, Xfinal is Xfinal1, Yfinal is Yfinal1, !.
checkCercoColuna(Board, X, Y, Xfinal, Yfinal, Xpos, Ypos, Jogador, R):- R is 0, !.
checkCercoColunaCheck(Board, X, Y, Xfinal, Yfinal, Xpos, Ypos, Jogador, R):- Xpos == 8,Ypos==8, R is 0, !.


checkCorner(Board, X, Y, Xfinal, Yfinal, Xpos, Ypos, Jogador, R):- Jogador == 1, (Xpos==1, Ypos==1), getElem(Board, Xpos, Ypos, Elem), branco(Elem), getElem(Board, 1, 2, Elem1), getElem(Board, 2, 1, Elem2), ((preto(Elem1), espacovazio(Elem2),  hasPieceToMoveToPos(Board, 2, 1, X1, Y1, Jogador, R1), R1== 1, R is R1, X is 2, Y is 1, Xfinal is X1, Yfinal is Y1, !); (espacovazio(Elem1), preto(Elem2), hasPieceToMoveToPos(Board, 1, 2, X1, Y1, Jogador, R1), R1== 1, R is R1, X is 1, Y is 2, Xfinal is X1, Yfinal is Y1, !)).
checkCorner(Board, X, Y, Xfinal, Yfinal, Xpos, Ypos, Jogador, R):- Jogador == 1, (Xpos==1, Ypos==8), getElem(Board, Xpos, Ypos, Elem), branco(Elem), getElem(Board, 1, 7, Elem1), getElem(Board, 2, 8, Elem2), ((preto(Elem1), espacovazio(Elem2),  hasPieceToMoveToPos(Board, 2, 8, X1, Y1, Jogador, R1), R1== 1, R is R1, X is 2, Y is 8, Xfinal is X1, Yfinal is Y1, !); (espacovazio(Elem1), preto(Elem2), hasPieceToMoveToPos(Board, 1, 7, X1, Y1, Jogador, R1), R1== 1, R is R1, X is 1, Y is 7, Xfinal is X1, Yfinal is Y1, !)).
checkCorner(Board, X, Y, Xfinal, Yfinal, Xpos, Ypos, Jogador, R):- Jogador == 1, (Xpos==8, Ypos==1), getElem(Board, Xpos, Ypos, Elem), branco(Elem), getElem(Board, 7, 1, Elem1), getElem(Board, 8, 2, Elem2), ((preto(Elem1), espacovazio(Elem2),  hasPieceToMoveToPos(Board, 8, 2, X1, Y1, Jogador, R1), R1== 1, R is R1, X is 8, Y is 2, Xfinal is X1, Yfinal is Y1, !); (espacovazio(Elem1), preto(Elem2), hasPieceToMoveToPos(Board, 7, 1, X1, Y1, Jogador, R1), R1== 1, R is R1, X is 7, Y is 1, Xfinal is X1, Yfinal is Y1, !)).
checkCorner(Board, X, Y, Xfinal, Yfinal, Xpos, Ypos, Jogador, R):- Jogador == 1, (Xpos==8, Ypos==8), getElem(Board, Xpos, Ypos, Elem), branco(Elem), getElem(Board, 7, 8, Elem1), getElem(Board, 8, 7, Elem2), ((preto(Elem1), espacovazio(Elem2),  hasPieceToMoveToPos(Board, 8, 7, X1, Y1, Jogador, R1), R1== 1, R is R1, X is 8, Y is 7, Xfinal is X1, Yfinal is Y1, !); (espacovazio(Elem1), preto(Elem2), hasPieceToMoveToPos(Board, 7, 8, X1, Y1, Jogador, R1), R1== 1, R is R1, X is 7, Y is 8, Xfinal is X1, Yfinal is Y1, !)).

checkCorner(Board, X, Y, Xfinal, Yfinal, Xpos, Ypos, Jogador, R):- Jogador == 2, (Xpos==1, Ypos==1), getElem(Board, Xpos, Ypos, Elem), preto(Elem), getElem(Board, 1, 2, Elem1), getElem(Board, 2, 1, Elem2), ((branco(Elem1), espacovazio(Elem2),  hasPieceToMoveToPos(Board, 2, 1, X1, Y1, Jogador, R1), R1== 1, R is R1, X is 2, Y is 1, Xfinal is X1, Yfinal is Y1, !); (espacovazio(Elem1), branco(Elem2), hasPieceToMoveToPos(Board, 1, 2, X1, Y1, Jogador, R1), R1== 1, R is R1, X is 1, Y is 2, Xfinal is X1, Yfinal is Y1, !)).
checkCorner(Board, X, Y, Xfinal, Yfinal, Xpos, Ypos, Jogador, R):- Jogador == 2, (Xpos==1, Ypos==8), getElem(Board, Xpos, Ypos, Elem), preto(Elem), getElem(Board, 1, 7, Elem1), getElem(Board, 2, 8, Elem2), ((branco(Elem1), espacovazio(Elem2),  hasPieceToMoveToPos(Board, 2, 8, X1, Y1, Jogador, R1), R1== 1, R is R1, X is 2, Y is 8, Xfinal is X1, Yfinal is Y1, !); (espacovazio(Elem1), branco(Elem2), hasPieceToMoveToPos(Board, 1, 7, X1, Y1, Jogador, R1), R1== 1, R is R1, X is 1, Y is 7, Xfinal is X1, Yfinal is Y1, !)).
checkCorner(Board, X, Y, Xfinal, Yfinal, Xpos, Ypos, Jogador, R):- Jogador == 2, (Xpos==8, Ypos==1), getElem(Board, Xpos, Ypos, Elem), preto(Elem), getElem(Board, 7, 1, Elem1), getElem(Board, 8, 2, Elem2), ((branco(Elem1), espacovazio(Elem2),  hasPieceToMoveToPos(Board, 8, 2, X1, Y1, Jogador, R1), R1== 1, R is R1, X is 8, Y is 2, Xfinal is X1, Yfinal is Y1, !); (espacovazio(Elem1), branco(Elem2), hasPieceToMoveToPos(Board, 7, 1, X1, Y1, Jogador, R1), R1== 1, R is R1, X is 7, Y is 1, Xfinal is X1, Yfinal is Y1, !)).
checkCorner(Board, X, Y, Xfinal, Yfinal, Xpos, Ypos, Jogador, R):- Jogador == 2, (Xpos==8, Ypos==8), getElem(Board, Xpos, Ypos, Elem), preto(Elem), getElem(Board, 7, 8, Elem1), getElem(Board, 8, 7, Elem2), ((branco(Elem1), espacovazio(Elem2),  hasPieceToMoveToPos(Board, 8, 7, X1, Y1, Jogador, R1), R1== 1, R is R1, X is 8, Y is 7, Xfinal is X1, Yfinal is Y1, !); (espacovazio(Elem1), branco(Elem2), hasPieceToMoveToPos(Board, 7, 8, X1, Y1, Jogador, R1), R1== 1, R is R1, X is 7, Y is 8, Xfinal is X1, Yfinal is Y1, !)).
checkCorner(Board, X, Y, Xfinal, Yfinal, Xpos, Ypos, Jogador, R):- R is 0, !.




/* -Has piece to move to line- */
hasPieceToMoveToPos(Board, Xpos, Ypos, Xfinal, Yfinal, Jogador, R):- hasPieceToMoveToPosColuna(Board, Xpos, Ypos, 1, Xfinal1, Yfinal1, Jogador, R1), R1==1, R is 1, Xfinal is Xfinal1, Yfinal is Yfinal1, !.
hasPieceToMoveToPos(Board, Xpos, Ypos, Xfinal, Yfinal, Jogador, R):- hasPieceToMoveToPosLine(Board, Xpos, Ypos, 1, Xfinal1, Yfinal1, Jogador, R1), R1==1, R is 1, Xfinal is Xfinal1, Yfinal is Yfinal1, !.
hasPieceToMoveToPos(Board, Xpos, Ypos, Xfinal, Yfinal, Jogador, R):- R is 0.

hasPieceToMoveToPosLine(Board, Xpos, Ypos, N, Xfinal, Yfinal, Jogador, R):- Jogador==1, N<9, getElem(Board, Xpos, N, Elem), preto(Elem), checkMovimentoHorizontal(Board, Xpos, Xpos, N, Ypos, 1, R),((R==1, Xfinal is Xpos, Yfinal is N, !);(R==0, N1 is N+1, hasPieceToMoveToPosLine(Board, Xpos, Ypos, N1, Xfinal, Yfinal, Jogador, R1))).
hasPieceToMoveToPosLine(Board, Xpos, Ypos, N, Xfinal, Yfinal, Jogador, R):- Jogador==1, N<9, getElem(Board, Xpos, N, Elem), \+preto(Elem), N1 is N+1, hasPieceToMoveToPosLine(Board, Xpos, Ypos, N1, Xfinal, Yfinal, Jogador, R).
hasPieceToMoveToPosLine(Board, Xpos, Ypos, N, Xfinal, Yfinal, Jogador, R):- Jogador==2, N<9, getElem(Board, Xpos, N, Elem), branco(Elem),checkMovimentoHorizontal(Board, Xpos, Xpos, N, Ypos, 1, R), ((R==1, Xfinal is Xpos, Yfinal is N, !);(R==0, N1 is N+1, hasPieceToMoveToPosLine(Board, Xpos, Ypos, N1, Xfinal, Yfinal, Jogador, R1))).
hasPieceToMoveToPosLine(Board, Xpos, Ypos, N, Xfinal, Yfinal, Jogador, R):- Jogador==2, N<9, getElem(Board, Xpos, N, Elem), \+branco(Elem), N1 is N+1, hasPieceToMoveToPosLine(Board, Xpos, Ypos, N1, Xfinal, Yfinal, Jogador, R).
hasPieceToMoveToPosLine(Board, Xpos, Ypos, N, Xfinal, Yfinal, Jogador, R):- N ==9, R is 0.

hasPieceToMoveToPosColuna(Board, Xpos, Ypos, N, Xfinal, Yfinal, Jogador, R):- Jogador==1, N<9, getElem(Board, N, Ypos, Elem), preto(Elem), checkMovimentoVertical(Board, N, Xpos, Ypos, Ypos, 1, R),((R==1, Xfinal is N, Yfinal is Ypos, !);(R==0, N1 is N+1, hasPieceToMoveToPosColuna(Board, Xpos, Ypos, N1, Xfinal, Yfinal, Jogador, R1))).
hasPieceToMoveToPosColuna(Board, Xpos, Ypos, N, Xfinal, Yfinal, Jogador, R):- Jogador==1, N<9, getElem(Board, N, Ypos, Elem), \+preto(Elem), N1 is N+1, hasPieceToMoveToPosColuna(Board, Xpos, Ypos, N1, Xfinal, Yfinal, Jogador, R).
hasPieceToMoveToPosColuna(Board, Xpos, Ypos, N, Xfinal, Yfinal, Jogador, R):- Jogador==2, N<9, getElem(Board, N, Ypos, Elem), branco(Elem),checkMovimentoVertical(Board, N, Xpos, Ypos, Ypos, 1, R), ((R==1, Xfinal is N, Yfinal is Ypos, !);(R==0, N1 is N+1, hasPieceToMoveToPosColuna(Board, Xpos, Ypos, N1, Xfinal, Yfinal, Jogador, R1))).
hasPieceToMoveToPosColuna(Board, Xpos, Ypos, N, Xfinal, Yfinal, Jogador, R):- Jogador==2, N<9, getElem(Board, N, Ypos, Elem), \+branco(Elem), N1 is N+1, hasPieceToMoveToPosColuna(Board, Xpos, Ypos, N1, Xfinal, Yfinal, Jogador, R).
hasPieceToMoveToPosColuna(Board, Xpos, Ypos, N, Xfinal, Yfinal, Jogador, R):- N ==9, R is 0.


/* -TwoStepCerco */

checkCerco(Board, X, Y, Xfinal, Yfinal, Jogador, R):- checkCercoLinhaCheck(Board, X1, Y1, Xfinal1, Yfinal1, 1, 1, Jogador, R1) , R1==1, X is X1, Y is Y1, Xfinal is Xfinal1, Yfinal is Yfinal1, R is 1, !.
checkCerco(Board, X, Y, Xfinal, Yfinal, Jogador, R):- checkCercoColunaCheck(Board, X1, Y1, Xfinal1, Yfinal1, 1, 1, Jogador, R1) , R1==1, X is X1, Y is Y1, Xfinal is Xfinal1, Yfinal is Yfinal1, R is 1, !.
checkCerco(Board, X, Y, Xfinal, Yfinal, Jogador, R):- R is 0.

checkCercoLinhaCheck(Board, X, Y, Xfinal, Yfinal, Xpos, Ypos, Jogador, R):- checkCercoLinha(Board, X1, Y1, Xfinal1, Yfinal1, Xpos, Ypos, Jogador, R1), ((R1==0,  ((Ypos==8,Xpos<8, Ypos1 is 1, Xpos1 is Xpos + 1, checkCercoLinhaCheck(Board, X, Y, Xfinal, Yfinal, Xpos1 , Ypos1, Jogador, R));(Ypos<8,Ypos1 is Ypos+1, checkCercoLinhaCheck(Board, X, Y, Xfinal, Yfinal, Xpos , Ypos1, Jogador, R)))) ; (R1 == 1, R is 1, X is Xfinal1, Y is Yfinal1, Xfinal is X1, Yfinal is Y1, !)).
checkCercoLinha(Board, X, Y, Xfinal, Yfinal, Xpos, Ypos, Jogador, R):- Jogador == 1, getElem(Board, Xpos, Ypos, Elem), branco(Elem), YposLeft is Ypos-1, YposRight is Ypos+1,getElem(Board, Xpos, YposLeft, ElemLeft), getElem(Board, Xpos, YposRight, ElemRight), (preto(ElemLeft), espacovazio(ElemRight), hasPieceToMoveToPos(Board, Xpos, YposRight, Xfinal1, Yfinal1, Jogador, R1), R1== 1, R is R1, X is Xpos, Y is YposRight, Xfinal is Xfinal1, Yfinal is Yfinal1, !).
checkCercoLinha(Board, X, Y, Xfinal, Yfinal, Xpos, Ypos, Jogador, R):- Jogador == 1, getElem(Board, Xpos, Ypos, Elem), branco(Elem), YposLeft is Ypos-1, YposRight is Ypos+1,getElem(Board, Xpos, YposLeft, ElemLeft), getElem(Board, Xpos, YposRight, ElemRight), (espacovazio(ElemLeft), preto(ElemRight), hasPieceToMoveToPos(Board, Xpos, YposLeft, Xfinal1, Yfinal1, Jogador, R1), R1== 1, R is R1, X is Xpos, Y is YposLeft, Xfinal is Xfinal1, Yfinal is Yfinal1, !).
checkCercoLinha(Board, X, Y, Xfinal, Yfinal, Xpos, Ypos, Jogador, R):- Jogador == 2, getElem(Board, Xpos, Ypos, Elem), preto(Elem), YposLeft is Ypos-1, YposRight is Ypos+1,getElem(Board, Xpos, YposLeft, ElemLeft), getElem(Board, Xpos, YposRight, ElemRight), (branco(ElemLeft), espacovazio(ElemRight), hasPieceToMoveToPos(Board, Xpos, YposRight, Xfinal1, Yfinal1, Jogador, R1), R1== 1, R is R1, X is Xpos, Y is YposRight, Xfinal is Xfinal1, Yfinal is Yfinal1, !).
checkCercoLinha(Board, X, Y, Xfinal, Yfinal, Xpos, Ypos, Jogador, R):- Jogador == 2, getElem(Board, Xpos, Ypos, Elem), preto(Elem), YposLeft is Ypos-1, YposRight is Ypos+1,getElem(Board, Xpos, YposLeft, ElemLeft), getElem(Board, Xpos, YposRight, ElemRight), (espacovazio(ElemLeft), branco(ElemRight), hasPieceToMoveToPos(Board, Xpos, YposLeft, Xfinal1, Yfinal1, Jogador, R1), R1== 1, R is R1, X is Xpos, Y is YposLeft, Xfinal is Xfinal1, Yfinal is Yfinal1, !).
checkCercoLinha(Board, X, Y, Xfinal, Yfinal, Xpos, Ypos, Jogador, R):- R is 0.
checkCercoLinhaCheck(Board, X, Y, Xfinal, Yfinal, Xpos, Ypos, Jogador, R):- Xpos == 8,Ypos==8, R is 0.

checkCercoColunaCheck(Board, X, Y, Xfinal, Yfinal, Xpos, Ypos, Jogador, R):-  checkCercoColuna(Board, X1, Y1, Xfinal1, Yfinal1, Xpos, Ypos, Jogador, R1), ((R1==0,  ((Ypos==8,Xpos<8, Ypos1 is 1, Xpos1 is Xpos + 1, checkCercoColunaCheck(Board, X, Y, Xfinal, Yfinal, Xpos1 , Ypos1, Jogador, R));(Ypos<8,Ypos1 is Ypos+1, checkCercoColunaCheck(Board, X, Y, Xfinal, Yfinal, Xpos , Ypos1, Jogador, R)))) ; ( R1 == 1, R is 1, X is Xfinal1, Y is Yfinal1, Xfinal is X1, Yfinal is Y1, !)).
checkCercoColuna(Board, X, Y, Xfinal, Yfinal, Xpos, Ypos, Jogador, R):- Jogador == 1, getElem(Board, Xpos, Ypos, Elem), branco(Elem), XposAbove is Xpos-1, XposBellow is Xpos+1,getElem(Board, XposAbove, Ypos, ElemAbove), getElem(Board, XposBellow, Ypos, ElemBellow), (preto(ElemAbove), espacovazio(ElemBellow), hasPieceToMoveToPos(Board, XposBellow, Ypos, Xfinal1, Yfinal1, Jogador, R1), R1== 1, R is R1, X is XposBellow, Y is Ypos, Xfinal is Xfinal1, Yfinal is Yfinal1, !).
checkCercoColuna(Board, X, Y, Xfinal, Yfinal, Xpos, Ypos, Jogador, R):- Jogador == 1, getElem(Board, Xpos, Ypos, Elem), branco(Elem), XposAbove is Xpos-1, XposBellow is Xpos+1,getElem(Board, XposAbove, Ypos, ElemAbove), getElem(Board, XposBellow, Ypos, ElemBellow), (espacovazio(ElemAbove), preto(ElemBellow), hasPieceToMoveToPos(Board, XposAbove, Ypos, Xfinal1, Yfinal1, Jogador, R1), R1== 1, R is R1, X is XposAbove, Y is Ypos, Xfinal is Xfinal1, Yfinal is Yfinal1, !).
checkCercoColuna(Board, X, Y, Xfinal, Yfinal, Xpos, Ypos, Jogador, R):- Jogador == 2, getElem(Board, Xpos, Ypos, Elem), preto(Elem), XposAbove is Xpos-1, XposBellow is Xpos+1,getElem(Board, XposAbove, Ypos, ElemAbove), getElem(Board, XposBellow, Ypos, ElemBellow), (branco(ElemAbove), espacovazio(ElemBellow), hasPieceToMoveToPos(Board, XposBellow, Ypos, Xfinal1, Yfinal1, Jogador, R1), R1== 1, R is R1, X is XposBellow, Y is Ypos, Xfinal is Xfinal1, Yfinal is Yfinal1, !).
checkCercoColuna(Board, X, Y, Xfinal, Yfinal, Xpos, Ypos, Jogador, R):- Jogador == 2, getElem(Board, Xpos, Ypos, Elem), preto(Elem), XposAbove is Xpos-1, XposBellow is Xpos+1,getElem(Board, XposAbove, Ypos, ElemAbove), getElem(Board, XposBellow, Ypos, ElemBellow), (espacovazio(ElemAbove), branco(ElemBellow), hasPieceToMoveToPos(Board, XposAbove, Ypos, Xfinal1, Yfinal1, Jogador, R1), R1== 1, R is R1, X is XposAbove, Y is Ypos, Xfinal is Xfinal1, Yfinal is Yfinal1, !).
checkCercoColuna(Board, X, Y, Xfinal, Yfinal, Xpos, Ypos, Jogador, R):- R is 0.
checkCercoColunaCheck(Board, X, Y, Xfinal, Yfinal, Xpos, Ypos, Jogador, R):- Xpos == 8,Ypos==8, R is 0.

hasPieceToMoveToPos(Board, Xpos, Ypos, Xfinal, Yfinal, Jogador, R):- hasPieceToMoveToPosColuna(Board, Xpos, Ypos, 1, Xfinal1, Yfinal1, Jogador, R1), R1==1, R is 1, Xfinal is Xfinal1, Yfinal is Yfinal1, !.
hasPieceToMoveToPos(Board, Xpos, Ypos, Xfinal, Yfinal, Jogador, R):- hasPieceToMoveToPosLine(Board, Xpos, Ypos, 1, Xfinal1, Yfinal1, Jogador, R1), R1==1, R is 1, Xfinal is Xfinal1, Yfinal is Yfinal1, !.
hasPieceToMoveToPos(Board, Xpos, Ypos, Xfinal, Yfinal, Jogador, R):- R is 0.

hasPieceToMoveToPosLine(Board, Xpos, Ypos, N, Xfinal, Yfinal, Jogador, R):- Jogador==1, N<9, getElem(Board, Xpos, N, Elem), preto(Elem), checkMovimentoHorizontal(Board, Xpos, Xpos, N, Ypos, 1, R),((R==1, Xfinal is Xpos, Yfinal is N, !);(R==0, N1 is N+1, hasPieceToMoveToPosLine(Board, Xpos, Ypos, N1, Xfinal, Yfinal, Jogador, R1))).
hasPieceToMoveToPosLine(Board, Xpos, Ypos, N, Xfinal, Yfinal, Jogador, R):- Jogador==1, N<9, getElem(Board, Xpos, N, Elem), \+preto(Elem), N1 is N+1, hasPieceToMoveToPosLine(Board, Xpos, Ypos, N1, Xfinal, Yfinal, Jogador, R).
hasPieceToMoveToPosLine(Board, Xpos, Ypos, N, Xfinal, Yfinal, Jogador, R):- Jogador==2, N<9, getElem(Board, Xpos, N, Elem), branco(Elem),checkMovimentoHorizontal(Board, Xpos, Xpos, N, Ypos, 1, R), ((R==1, Xfinal is Xpos, Yfinal is N, !);(R==0, N1 is N+1, hasPieceToMoveToPosLine(Board, Xpos, Ypos, N1, Xfinal, Yfinal, Jogador, R1))).
hasPieceToMoveToPosLine(Board, Xpos, Ypos, N, Xfinal, Yfinal, Jogador, R):- Jogador==2, N<9, getElem(Board, Xpos, N, Elem), \+branco(Elem), N1 is N+1, hasPieceToMoveToPosLine(Board, Xpos, Ypos, N1, Xfinal, Yfinal, Jogador, R).
hasPieceToMoveToPosLine(Board, Xpos, Ypos, N, Xfinal, Yfinal, Jogador, R):- N ==9, R is 0.

hasPieceToMoveToPosColuna(Board, Xpos, Ypos, N, Xfinal, Yfinal, Jogador, R):- Jogador==1, N<9, getElem(Board, N, Ypos, Elem), preto(Elem), checkMovimentoVertical(Board, N, Xpos, Ypos, Ypos, 1, R),((R==1, Xfinal is N, Yfinal is Ypos, !);(R==0, N1 is N+1, hasPieceToMoveToPosColuna(Board, Xpos, Ypos, N1, Xfinal, Yfinal, Jogador, R1))).
hasPieceToMoveToPosColuna(Board, Xpos, Ypos, N, Xfinal, Yfinal, Jogador, R):- Jogador==1, N<9, getElem(Board, N, Ypos, Elem), \+preto(Elem), N1 is N+1, hasPieceToMoveToPosColuna(Board, Xpos, Ypos, N1, Xfinal, Yfinal, Jogador, R).
hasPieceToMoveToPosColuna(Board, Xpos, Ypos, N, Xfinal, Yfinal, Jogador, R):- Jogador==2, N<9, getElem(Board, N, Ypos, Elem), branco(Elem),checkMovimentoVertical(Board, N, Xpos, Ypos, Ypos, 1, R), ((R==1, Xfinal is N, Yfinal is Ypos, !);(R==0, N1 is N+1, hasPieceToMoveToPosColuna(Board, Xpos, Ypos, N1, Xfinal, Yfinal, Jogador, R1))).
hasPieceToMoveToPosColuna(Board, Xpos, Ypos, N, Xfinal, Yfinal, Jogador, R):- Jogador==2, N<9, getElem(Board, N, Ypos, Elem), \+branco(Elem), N1 is N+1, hasPieceToMoveToPosColuna(Board, Xpos, Ypos, N1, Xfinal, Yfinal, Jogador, R).
hasPieceToMoveToPosColuna(Board, Xpos, Ypos, N, Xfinal, Yfinal, Jogador, R):- N ==9, R is 0.



/*Jogador Comanda*/

comanda(Jogador, Peca):- Jogador == 1, peaopreto(Peca).
comanda(Jogador, Peca):- Jogador == 1, reipreto(Peca).
comanda(Jogador, Peca):- Jogador == 2, reibranco(Peca).
comanda(Jogador, Peca):- Jogador == 2, peaobranco(Peca).


/*Recome�a Jogo*/

recomecarJogo:- write('Recome�ar Jogo (s/n)'), read(YesNo), (((YesNo == 's'), startGame, !);((YesNo \= 's'), !)).


/* Novo Jogo*/

novoJogo(2):-  write('PC - dificuldade(1 or 2) '), nl, read(Pc1), ((Pc1 \= 1, Pc1 \= 2, write('Dificuldade 1 ou 2'),nl , novoJogo(2)); ((Pc1 == 1; Pc1 == 2), tabuleiro(Board), mostra(Board), novoMovimento(Board, 1, 1, 0, Pc1, X, Y, Xfinal, Yfinal, Result))).
novoJogo(3):-  write('PC1 - dificuldade(1 or 2) '), read(Pc1), write('PC2 - dificuldade(1 or 2) '), read(Pc2), ((((Pc2 \= 2, Pc2 \= 1); (Pc1 \= 2, Pc1 \= 1)), write('Dificuldade 1 ou 2'), nl, novoJogo(3)); ((Pc1 == 1; Pc1 == 2), (Pc2 == 1; Pc2 == 2), tabuleiro(Board), mostra(Board), novoMovimento(Board, 1, 1, Pc1, Pc2, X, Y, Xfinal, Yfinal, Result))).

startGame:- write('**********************************************************************'),nl,
			write('*                                                                    *'),nl,
			write('*  _               _                                           _   _ *'),nl,
			write('* | |       __ _  | |_   _ __   _   _   _ __     ___   _   _  | | (_)*'),nl,
			write('* | |      / _` | | __| | `__| | | | | | `_ `   / __| | | | | | | | |*'),nl,
			write('* | |___  | (_| | | |_  | |    | |_| | | | | | | (__  | |_| | | | | |*'),nl,
			write('* |_____|  `__,_|  `__| |_|    |___,_| |_| |_|  `___| |___,_| |_| |_|*'),nl,
			write('*                                                                    *'),nl,
			write('*                                                                    *'),nl,
			write('*                           __  __ __  __  ___                       *'),nl,
			write('*                           ` `� � ` `� � |_ _|                      *'),nl,
			write('*                            `  �   `  �   | |                       *'),nl,
			write('*                            �  `   �  `   | |                       *'),nl,
			write('*                           �_�`_` �_�`_` |___|                      *'),nl,
			write('*                                                                    *'),nl,
			write('*                                                                    *'),nl,
			write('**********************************************************************'),nl,
			typeOfGame.
			
typeOfGame:- write('1 - 1 vs 1'), nl, write('2 - 1 vs PC'), nl, write('3 - PC vs PC'), nl, write('4 - Sair'), nl, read(TypeOfGame), nl, ((TypeOfGame \= 1, TypeOfGame \= 2, TypeOfGame \= 3, TypeOfGame \= 4, write('Tipe do Jogo 1, 2, 3 ou 4'), nl, typeOfGame);((TypeOfGame == 1; TypeOfGame == 2; TypeOfGame == 3), novoJogo(TypeOfGame); (TypeOfGame == 4, !))).

endGame(Jogador):- write('O Jogador '), write(Jogador), write(' Ganhou o Jogo!!!'), !.

/*Novo Movimento*/

novoMovimento(Board, Jogador, Counter, Pc1, Pc2, X, Y, Xfinal, Yfinal, Result):-not_inst(Result), write('asd'), nl, Counter < 51, ((Jogador==1,Pc1==0);(Jogador==2,Pc2==0)), print('� a vez do Jogador '), print(Jogador), nl, print(' Mover Pe�a - Jogada #'), print(Counter),nl,  print('Linha da Pe�a a Mover: '), print(X), nl, print('Coluna da Pe�a a Mover: '), print(Y), nl, print('Linha para onde a pe�a � movida: '), print(Xfinal), nl, print('Coluna para onde a pe�a � movida: '), print(Yfinal),nl, write('a'), nl, checkMovimentoHorizontal(Board, X, Xfinal, Y, Yfinal, 1, Legal),write('1'),nl, ((Legal==0, write('Nao Pode Fazer Esta Jogada'), nl, write('Tente outro movimento'), nl, Result is -1, novoMovimento(Board, Jogador, Counter, Pc1, Pc2, X, Y, Xfinal, Yfinal, Result)); (Legal==1)), write('2'),nl,checkMovimentoVertical(Board, X, Xfinal, Y, Yfinal, 1, Legal2), write('3'),nl, ((Legal2==0, write('Nao Pode Fazer Esta Jogada'), nl, write('Tente outro movimento'), nl, Result is -1, novoMovimento(Board, Jogador, Counter, Pc1, Pc2, X, Y, Xfinal, Yfinal, Result)); (Legal2==1)), write('4'),nl, move(Board, EndBoard, Jogador, X, Y, Xfinal, Yfinal, Counter, 0, R, Pc1, Pc2), write('5'),nl,  ((R == 0, NewCounter is Counter+1, Result is 1,  write('6'),nl, nextPerson(EndBoard, Jogador, NewCounter, 0, Pc1, Pc2));(R == 1, endGame(Jogador))). 

novoMovimento(Board, Jogador, Counter, PC1, Pc2):- Counter >= 51, write('N�mero M�ximo de Jogadas!!!'), startGame, !.

nextPerson(Board, 1, Counter, 0, Pc1, Pc2):- checkPeoes(Board, 1, 1, 1, Counter, Pc1, Pc2).
nextPerson(Board, 2, Counter, 0, Pc1, Pc2):- checkPeoes(Board, 1, 1, 2, Counter, Pc1, Pc2).


not_inst(Var):-
  \+(\+(Var=0)),
  \+(\+(Var=1)).

:-use_module(library(sockets)).
:-use_module(library(lists)).
:-use_module(library(codesio)).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                        Server                                                   %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% To run, enter 'server.' on sicstus command line after consulting this file.
% You can test requests to this server by going to http://localhost:8081/<request>.
% Go to http://localhost:8081/quit to close server.

% Made by Luis Reis (ei12085@fe.up.pt) for LAIG course at FEUP.

port(8081).

% Server Entry Point
server :-
	port(Port),
	write('Opened Server'),nl,nl,
	socket_server_open(Port, Socket),
	server_loop(Socket),
	socket_server_close(Socket),
	write('Closed Server'),nl.

% Server Loop 
% Uncomment writes for more information on incomming connections
server_loop(Socket) :-
	repeat,
	socket_server_accept(Socket, _Client, Stream, [type(text)]),
		% write('Accepted connection'), nl,
	    % Parse Request
		catch((
			read_request(Stream, Request),
			read_header(Stream)
		),_Exception,(
			% write('Error parsing request.'),nl,
			close_stream(Stream),
			fail
		)),
		
		% Generate Response
		handle_request(Request, MyReply, Status),Request is 1,
		format('Request: ~q~n',[Request]),
		format('Reply: ~q~n', [MyReply]),
		
		% Output Response
		format(Stream, 'HTTP/1.0 ~p~n', [Status]),
		format(Stream, 'Access-Control-Allow-Origin: *~n', []),
		format(Stream, 'Content-Type: text/plain~n~n', []),
		format(Stream, '~p', [MyReply]),
	
		% write('Finnished Connection'),nl,nl,
		close_stream(Stream),
	(Request = quit), !.
	
close_stream(Stream) :- flush_output(Stream), close(Stream).

% Handles parsed HTTP requests
% Returns 200 OK on successful aplication of parse_input on request
% Returns 400 Bad Request on syntax error (received from parser) or on failure of parse_input
handle_request(Request, MyReply, '200 OK') :- parse_input(Request, MyReply).
handle_request(syntax_error, 'Syntax Error', '400 Bad Request') :- !.
handle_request(_, 'Bad Request', '400 Bad Request').

% Reads first Line of HTTP Header and parses request
% Returns term parsed from Request-URI
% Returns syntax_error in case of failure in parsing
read_request(Stream, Request) :-
	read_line(Stream, LineCodes),
	print_header_line(LineCodes),
	
	% Parse Request
	atom_codes('GET /',Get),
	append(Get,RL,LineCodes),
	read_request_aux(RL,RL2),	
	
	catch(read_from_codes(RL2, Request), error(syntax_error(_),_), fail), !.
read_request(_,syntax_error).
	
read_request_aux([32|_],[46]) :- !.
read_request_aux([C|Cs],[C|RCs]) :- read_request_aux(Cs, RCs).


% Reads and Ignores the rest of the lines of the HTTP Header
read_header(Stream) :-
	repeat,
	read_line(Stream, Line),
	print_header_line(Line),
	(Line = []; Line = end_of_file),!.

check_end_of_header([]) :- !, fail.
check_end_of_header(end_of_file) :- !,fail.
check_end_of_header(_).

% Function to Output Request Lines (uncomment the line bellow to see more information on received HTTP Requests)
% print_header_line(LineCodes) :- catch((atom_codes(Line,LineCodes),write(Line),nl),_,fail), !.
print_header_line(_).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                       Commands                                                  %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Require your Prolog Files here

parse_input(novoMovimento(Board, Jogador, Counter, Pc1, Pc2, X, Y, Xfinal, Yfinal), Result):- write('200'), nl, novoMovimento(Board, Jogador, Counter, Pc1, Pc2, X, Y, Xfinal, Yfinal, Result), nl,write('Result'), write(Result).
parse_input(handshake, handshake).
parse_input(test(C,N), Res) :- test(C,Res,N).
parse_input(quit, goodbye).

test(_,[],N) :- N =< 0.
test(A,[A|Bs],N) :- N1 is N-1, test(A,Bs,N1).



