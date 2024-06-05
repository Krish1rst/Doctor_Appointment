import Jwt from "jsonwebtoken";


const fetchUser = async (req, res, next) => {
  try {
    const token = req.headers['authorization'].split(" ")[1];
    Jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({ error: 'Auth faild', success: false });
      }
      else {
        req.body.userId = decoded.id;
        next();
      }
    });
  } catch (error) {
    res.status(400).send({ message: "Error while token varification", success: false, error });
  }
}



export default fetchUser;