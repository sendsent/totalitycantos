# Totality of Cantos Generator V 2.0
###React version of the random cantos generator project written in plain JS with P5js for Brian Ang 

###randomly generate and display an arbitrary number of canto sections. 

###each section must fit the following constraints:  
-for each pair of cantos
  -the canto positioned on top must not contain the same number of words or margin spaces in its last line of text as the first line of text in the section that proceeds after it.


###Issues Fixed:
-application freezes when large number of cantos is being generated
-clashes with canto position/not fitting wordcount and margincount constraints
-