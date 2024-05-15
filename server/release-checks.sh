# i wouldnt want this
grep 'wasd-controls' ../index.html

# wild console logs
grep -inr 'console.log' ../src/

# are they assign-binding the same function
grep -inr 'AFRAME.utils.bind' ../src/

# temporary code that should be removed
grep -inr 'REM:' ../src/