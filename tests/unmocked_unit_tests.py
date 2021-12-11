import unittest
import sys
import os

# getting the name of the directory
# where the this file is present.
current = os.path.dirname(os.path.realpath(__file__))

# Getting the parent directory name
# where the current directory is present.
parent = os.path.dirname(current)

# adding the parent directory to
# the sys.path.
sys.path.append(parent)

from tmdb import get_detail_movie, get_search_movie

INPUT = "INPUT"
EXPECTED_OUTPUT = "EXPECTED_OUTPUT"


class DetailTests(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [
            {
                INPUT: 580489,
                EXPECTED_OUTPUT: (
                    "https://www.themoviedb.org/t/p/w185_and_h278_multi_faces/rjkmN1dniUHVYAtwuV3Tji7FsDO.jpg",
                    "Venom: Let There Be Carnage",
                    "2021-09-30",
                    "97 min",
                    ["Science Fiction", "Action", "Adventure"],
                    "After finding a host body in investigative reporter Eddie Brock, the alien symbiote must face a new enemy, Carnage, the alter ego of serial killer Cletus Kasady.",
                ),
            }
        ]

    def test_get_detail_movie(self):
        for test in self.success_test_params:
            actual_result = get_detail_movie(test[INPUT])
            expected_result = test[EXPECTED_OUTPUT]
            self.assertEqual(actual_result, expected_result)


class SearchTest(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [
            {
                INPUT: "avenger",
                EXPECTED_OUTPUT: (
                    True,
                    "1771",
                    "https://www.themoviedb.org/t/p/w185_and_h278_multi_faces/vSNxAJTlD0r02V9sPYpOjqDZXUK.jpg",
                    "Captain America: The First Avenger",
                    "7/10",
                    "2011-07-22",
                    "86.645",
                ),
            }
        ]

    def test_get_search_movie(self):
        for test in self.success_test_params:
            search_results = get_search_movie("avenger")
            actual_result = (
                search_results.exist_search_movie,
                search_results.id_movie[0],
                search_results.poster_path[0],
                search_results.title[0],
                search_results.vote_average[0],
                search_results.release_date[0],
                search_results.popularity[0],
            )
            expected_result = test[EXPECTED_OUTPUT]
            self.assertEqual(actual_result, expected_result)


if __name__ == "__main__":
    unittest.main()
