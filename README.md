INSTALLATION OF FILES:

to install backend files:
  cd backend
  npm install

to install frontend files:
  cd frontend
  npm install

to install hardhat files(blockchain):
  cd backend/hardhat
  npm install

------------------------------------------------------------------------------------------

RUNNING INSTRUCTUIONS:-

when running the program, you need the following terminals:

  1. hardhat node(to basically run hardhat i.e. blockchain service):-
       cd backend/hardhat
       npx hardhat node

  2. smart contract deployment:-
       npx hardhat run scripts/deploy.js --network localhost

  3. backend of the program:-
       cd backend
       node src/server.js

  4. frontend:-
       cd frontend
       npm run dev

-----------------------------------------------------------------------------------------

NOTE: clear the mongodb database of the information before using, so that you can't see the previous uploaded files

steps:
  mongosh
  use secure_files
  db.users.deleteMany({})


----------------------------------------------------------------------------------------

YOU ALSO NEED TO INSTALL IPFS APP FOR THE WORKING:
https://github.com/ipfs/ipfs-desktop/releases/download/v0.48.0/ipfs-desktop-setup-0.48.0-win-x64.exe

download this.
Always open this app before running the program. OR IT WILL NOT WORK.

----------------------------------------------------------------------------------------

Everything should work fine now.




     
