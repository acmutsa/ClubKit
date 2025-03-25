#!/bin/bash
set -e
echo "Welcome to Infisical CLI setup ✨"
brew install infisical/get-cli/infisical
printf "Infisical CLI installed successfully!\n\n"
echo "Next, log in to the Infisical CLI. When prompted, please select custom 'Self-Hosting or Dedicated Instance'"
echo "For the domain, please input 'https://https://env.acmutsa.org'"
infisical login
printf "\n\nNow, we are going to initialize the Infisical enviorment\n"
infisical init
printf "\n\nAlmost there! Setting grabbing the enviorment variables...\n"
infisical export > .env
printf "\n\nGreat! You can run the command 'infisical export > .env' anytime you want to update your enviorment variables 🔥\n"
read -r -p "For ease of use, would you like a shortcut for the command? (y/n) " shortcut
if [ $shortcut == "y" ]; then
  read -r -p "Please type which profile you are using (e.g. bash, zsh, etc) " profile
  
  if [ $profile == "bash" ]; then
    if grep -q "alias env-pull='infisical export > .env'" ~/.bash_profile; then
      echo "Shortcut already exists! You can run 'env-pull' to update your enviorment variables."
    else 
      echo "alias env-pull='infisical export > .env'" >> ~/.bash_profile
      echo "Shortcut created! You can now run 'env-pull' to update your enviorment variables."
      source ~/.bash_profile
    fi
  elif [ $profile == "zsh" ]; then
    if grep -q "alias env-pull='infisical export > .env'" ~/.zshrc; then
      echo "Shortcut already exists! You can run 'env-pull' to update your enviorment variables."
    else 
      echo "alias env-pull='infisical export > .env'" >> ~/.zshrc
      echo "Shortcut created! You can now run 'env-pull' to update your enviorment variables."
      source ~/.zshrc
    fi
  else
    echo "Profile not supported. Please add the alias 'alias env-pull='infisical export > .env' to your profile."
  fi
fi
printf "\n\nSetup finished. Have a good day ✨\n"