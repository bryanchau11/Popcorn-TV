import unittest
from unittest.mock import MagicMock, patch
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

from app import save_comment, Comment

INPUT = "INPUT"
EXPECTED_OUTPUT = "EXPECTED_OUTPUT"


class CommentTests(unittest.TestCase):
    def setup(self):
        self.db_mock = [
            Comment(
                username="test",
                movie_id="550",
                comment_movie="this movie sucks",
                date_comment="11/16/2021",
                hour_comment="13:23",
                rating=1,
            )
        ]

    def mock_add_to_db(self, comment):
        self.db_mock.append(comment)

    def mock_db_commit(self):
        pass

    def test_save_comment(self):
        with patch("db.session.add", self.mock_add_to_db):
            with patch("db.session.commit", self.mock_db_commit):
                save_comment()
                self.assertEqual(len(self.db_mock), 2)


if __name__ == "__main__":
    unittest.main()
