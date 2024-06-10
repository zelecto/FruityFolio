import { motion } from "framer-motion";
import PropTypes from "prop-types";
export const AnimacionEntrada = ({ children }) => {
    return (
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
            {children}
        </motion.div>
    );
};

AnimacionEntrada.propTypes = {
  children: PropTypes.node.isRequired,
};
